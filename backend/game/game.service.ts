import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Game, GameStatus, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GameGateway } from './game.gateway';
import { ONLINE_MULTIPL_MODE_ID } from './lib/Modes';
import GameNetworkHandler, { OnlineGameState, OnlinePaddleState } from './lib/NetworkHandler';
import GameStateMachine, { Player } from './lib/StateMachine';
import GameTicker from './lib/Ticker';

/*==========================================================================*/

interface QueuedUser {
	intraName: string;
	socketId: string;
}

interface NetworkGame {
	[gameId: string]: {
		roomId: string;
		players: [string, string]; // intraNames
		networkHandler: GameNetworkHandler;
		stateMachine: GameStateMachine;
	}
}

/*==========================================================================*/

@Injectable()
export class GameService {
	private _matchmakingQueue: QueuedUser[] = [];
	private _games: NetworkGame = {};
	private _ticker: GameTicker;

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(GameGateway)
	private readonly gameGateway: GameGateway

	constructor() {
		this._ticker = new GameTicker(60);

		// Check the matchmaking queue every 5 seconds, asynchronously
		(async () => {
			while (42) {
				await this._checkQueue()
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		})();
	}

	/**
	 * Check the matchmaking queue and start games if there are enough players.
	 */
	private async _checkQueue() {
		if (this._matchmakingQueue.length >= 2) {
			//if more than 2 users are in queue: createGame -> leave queue -> startGame
			console.log(`Found 2 users in the queue to matchmake. Creating game...`);
			const game = await this.createGame(this._matchmakingQueue[0].intraName, this._matchmakingQueue[1].intraName);
			console.log(`Game ${game.id} created. Starting game...`);
			await this.startGame(game, this._matchmakingQueue[0], this._matchmakingQueue[1]);
		}
	}

	/**
	 * Add a user to the queue of users waiting for a game.
	 * @param intraName The intra name of the user to add to the queue
	 * @param id The socket id of the user to add to the queue
	 * @returns Returns true if the user was added to the queue, false on error
	 */
	joinQueue(intraName: string, id: string): boolean {
		if (this.findInQueue(intraName))
			return false;
		this._matchmakingQueue.push({ intraName, socketId: id });
		console.log(`${intraName} joined the queue`);
		return true;
	}

	/**
	 * Find a user in the matchmaking queue.
	 * @param intraNameOrSocketId The intra name of the user to find in the queue, or their socket id
	 * @returns A QueuedUser object if the user was found, undefined if otherwise.
	 */
	findInQueue(intraNameOrSocketId: string): QueuedUser | undefined {
		return this._matchmakingQueue.find((user) => user.intraName === intraNameOrSocketId || user.socketId === intraNameOrSocketId);
	}

	/**
	 * Remove a user from the queue of users waiting for a game.
	 * @param intraNameOrSocketId The intra name of the user to remove from the queue, or their socket id
	 * @returns Returns true if the user was removed from the queue, false on error
	 */
	leaveQueue(intraNameOrSocketId: string): boolean {
		const user: QueuedUser = this.findInQueue(intraNameOrSocketId);
		if (user) {
			this._matchmakingQueue.splice(this._matchmakingQueue.indexOf(user), 1);
			console.log(`${user.intraName} left the queue`);
			return true;
		}
		return false;
	}

	/**
	 * Create a new game between two users.
	 * @param user1Name The intra name of the first user
	 * @param user2Name The intra name of the second user
	 * @returns The newly created game. On error, use catch.
	 */
	async createGame(user1Name, user2Name) {
		console.log(user1Name, user2Name);
		const randomRoomString = (Math.random() + 1).toString(36).substring(7);
		const game = await this.prismaService.game.create({
			data: {
				status: GameStatus.ONGOING,
				players: {
					connect: [
						{ intraName: user1Name },
						{ intraName: user2Name }
					]
				},
				gameEvents: undefined,
				roomId: `game${user1Name}+${user2Name}+${randomRoomString}` // unused (TODO?)
			}
		})
		return game;
	}

	/**
	 * Connect two players to the same game and start the game.
	 * @param game The game to start
	 * @param user1 The first player
	 * @param user2 The second player
	 */
	async startGame(game: Game, user1: QueuedUser, user2: QueuedUser) {
		this.gameGateway.server
			.to(user1.socketId)
			.to(user2.socketId)
			.socketsJoin(game.roomId); //cant find any docs about this function but i guess it does what the name implies

		// Set up game cache for multiplayer events
		await this._setupInternalGame(game.id);

		// Let users know the game can start
		this.gameGateway.server.to(user1.socketId).to(user2.socketId).emit('gameStart', {
			gameId: game.id,
			player1: user1.intraName,
			player2: user2.intraName //add whatever you need
		})

		// Remove users from queue
		this.leaveQueue(user1.socketId);
		this.leaveQueue(user2.socketId);

		// TODO: game state machine server-side for cheat detection?

		console.log(`Game ${game.id} started between ${user1.intraName} and ${user2.intraName}. Room ID is ${game.roomId}.`);
	}

	/**
	 * Add a game event to a game.
	 * A game event defines something that happened in the game and holds the game state of right after the event.
	 * @param gameId The id of the game to add the event for
	 * @param gameEvent The event to add to this game
	 */
	async updateGameEvents(gameId, gameEvent) {
		const game = await this.prismaService.game.findFirst({
			where: { id: gameId },
			include: { gameEvents: true }
		})
		await this.prismaService.game.update({
			where: { id: gameId },
			data: {
				gameEvents: {
					set: [ ...game.gameEvents, gameEvent ]
				}
			}
		})
	}

	/**
	 * Add a connected user to any running games they are in.
	 * @param socketId The socket id of the user
	 * @param intraName The intra name of the user
	 * @returns Returns true if the user was added to any running games
	 */
	connectUserToGames(socketId, intraName) {
		let addedToAny: boolean = false;
		for (const gameId in this._games) {
			if (this._games[gameId].players.includes(intraName)) {
				this.gameGateway.server.to(socketId).socketsJoin(this._games[gameId].roomId);
				addedToAny = true;
			}
		}
		return addedToAny;
	}

	/**
	 * Add a game to the cache in this service.
	 * @param gameId The id of the game to add to the cache.
	 * @returns The cached game object.
	 */
	private async _setupInternalGame(gameId: number) {
		const game = await this.prismaService.game.findFirst({
				where: { id: gameId },
				include: { players: true }
			});
		if (!game) {
			console.warn(`Game ${gameId} does not exist`);
			throw new Error(`Game ${gameId} does not exist`);
		}
		if (game.status === GameStatus.ENDED) {
			console.warn(`Game ${gameId} has already ended`);
			throw new Error(`Game ${gameId} has already ended`);
		}
		if (game.players.length !== 2) {
			console.warn(`Game ${gameId} does not have exactly 2 players`);
			throw new Error(`Game ${gameId} does not have exactly 2 players`);
		}

		// Set up GameStateMachine
		const gameStateMachine = new GameStateMachine(game.id, this._ticker, { w: 1080, h: 720 }, ONLINE_MULTIPL_MODE_ID, { p1: game.players[0], p2: game.players[1] }, {
			onScoreUpdated: (p1Score: number, p2Score: number) => {
				console.log(`Score updated for game ${gameId}: ${p1Score} - ${p2Score}`);
				// TODO?
			},
			onBeepSound: () => {},
			onBoopSound: ()	=> {},
			onImportantStateChange: (state: OnlineGameState) => {
				console.log(`Sending game state update for game ${gameId} to room ${game.roomId} (players: ${game.players.map(p => p.intraName).join(', ')})`);
				networkHandler.sendState(state);
			},
			onPaddleMoveChange(paddleState: OnlinePaddleState) {
				// TODO?
			},
			onPlayerReady: (player: Player) => {
				// TODO?
			}
		}, true);

		// Set up the Network Handler
		const networkHandler = new GameNetworkHandler(game.id, this.gameGateway.server, null, (state: OnlinePaddleState | null, playerReadyPosition: string | null) => {
			gameStateMachine.handleOnlinePaddleState(state, playerReadyPosition);
		});

		// Add the game to the internal games
		this._games[gameId] = {
			roomId: game.roomId,
			players: [ game.players[0].intraName, game.players[1].intraName ],
			stateMachine: gameStateMachine,
			networkHandler: networkHandler
		}
		return this._games[gameId];
	}

	/**
	 * Send a game state to the opponent of a player.
	 * @param sourceUser The intraName of the source user
	 * @param gameId The game's gameID
	 * @param gameState The state to send over
	 */
	// async sendGameState(sourceUser, gameId, gameState) {
	// 	return new Promise<void>(async (resolve, reject) => {
	// 		if (!this._games[gameId]) {
	// 			// game does not exist in cache, add it again. Could be a game from an invite or something.
	// 			console.warn(`User ${sourceUser} tried to send a game state for a non-cached game`);
	// 			await this._setupInternalGame(gameId);
	// 		}
	// 		if (!this._games[gameId].players.includes(sourceUser)) {
	// 			console.warn(`User ${sourceUser} tried to send a game state for game ${gameId} but they are not in this game. In game: ${this._gameCache[gameId].players}`);
	// 			return reject('Unauthorized');
	// 		}
	// 		const otherSocketId = this._games[gameId].players.find((id) => id !== sourceUser);
	// 		console.log(`Sending game state to ${otherSocketId} (from ${sourceUser})`);
	// 		// this.gameGateway.server.to(otherSocketId).emit('serverGameState', gameState);
	// 		this.gameGateway.server.to(this._games[gameId].roomId).emit('serverGameState', gameState);
	// 		return resolve();
	// 	});
	// }

	/**
	 * Mark a game as finished and fill in the remaining data.
	 * @param gameId The ID of the game that has finished
	 * @param gameData An object defining who won the game including the scores
	 */
	async finishGame(gameId, gameData) {
		if (!this._games[gameId]) {
			console.warn(`Tried to finish game ${gameId} that was not running`);
			return;
		}

		// Stop the game ticker
		this._ticker.remove(this._games[gameId].stateMachine.getTickerId());

		// Remove game from the cache
		delete this._games[gameId];

		// Finalize game data in DB
		await this.prismaService.game.update({
			where: { id: gameId },
			data: {
				winnerId: gameData["winnerId"],
				loserScore: gameData["loserScore"],
				victorScore: gameData["victoreScore"]
			}
		})
	}

}

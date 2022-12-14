import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Game, GameStatus, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GameGateway } from './game.gateway';
import { ONLINE_MULTIPL_MODE_ID } from './lib/Modes';
import type { OnlineGameState, OnlinePaddleState } from './lib/NetworkTypes';
import GameStateMachine, { PausedReason, Player } from './lib/StateMachine';
import GameTicker from './lib/Ticker';

/*==========================================================================*/

export interface QueuedUser {
	intraName: string;
	socketId: string;
}

interface NetworkGame {
	roomId: string;
	players: [string, string]; // intraNames
	sockets: {
		[intraName: string]: string; // intraName: key, socketId: value
	}
	stateMachine: GameStateMachine;
}

/*==========================================================================*/

@Injectable()
export class GameService {
	private _matchmakingQueue: QueuedUser[] = [];
	private _games: {
		[gameId: number]: NetworkGame;
	} = {};
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
		await this.prismaService.game.update({
			where: { id: game.id },
			data: {
				status: GameStatus.ONGOING
			}
		});

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
	 * Check if a user is currently in an ongoing game.
	 * @param intraName The intra name of the user to check
	 * @param gameId If a gameId is given, only this game is checked. Otherwise, all games are checked.
	 * @returns The gameID of an ongoing game if the user is in one, NaN otherwise
	 */
	userInGame(intraName: string, gameId: number = NaN): number {
		if (!isNaN(gameId)) {
			if (!this._games[gameId])
				return NaN;
			for (const player of this._games[gameId].players) {
				if (player == intraName)
					return gameId;
			}
			return NaN;
		}
		for (const gameId in this._games) {
			console.log(`Checking if ${intraName} is in game ${(this._games[gameId].stateMachine.isPaused() ? "paused" : "ongoing")} game ${gameId}...`);
			if (this._games[gameId].stateMachine.isPaused())
				continue;
			for (const player of this._games[gameId].players) {
				if (player == intraName)
					return parseInt(gameId);
			}
		}
		return NaN;
	}

	/**
	 * Add a connected user a requested game
	 * @param socketId The socket id of the user
	 * @param intraName The intra name of the user
	 * @param gameId The id of the game to add the user to
	 * @returns Returns true if the user was added to any running games
	 */
	connectUserToGame(socketId, intraName, gameId): boolean {
		if (gameId in this._games) {
			this.gameGateway.server.to(socketId).socketsJoin(this._games[gameId].roomId);
			if (this.userInGame(intraName, gameId) && !this._games[gameId].sockets[intraName]) {
				this._games[gameId].sockets[intraName] = socketId;
				console.log(`Socket ${socketId} added to game ${gameId} as player ${intraName}`);
				return true;
			}
			console.log(`Socket ${socketId} (${intraName}) is now spectating game ${gameId}`);
			return true;
		}
		console.log(`Game ${gameId} does not exist in the list of running online games`);
		return false;
	}

	/**
	 * Remove a user from any running games they are in.
	 * @param socketId The socket id of the user
	 */
	disconnectUserFromGames(socketId: string) {
		for (const gameId in this._games) {
			// Ugly, but for some reason `socketId in Object.values(this._games[gameId].sockets)` doesn't work
			for (const intraName in this._games[gameId].sockets) {
				if (!this._games[gameId])
					continue; // this can happen if two people disconnect at the same time
				if (this._games[gameId].sockets[intraName] === socketId) {
					console.log(`A disconnected socket ${socketId} is in game ${gameId} as ${intraName}`);
					delete this._games[gameId].sockets[intraName];

					const stateMachine = this._games[gameId].stateMachine;

					// Find the player of the disconnected user
					if (stateMachine.player1.intraName == intraName) {
						stateMachine.pauseGame(PausedReason.GAME_WON_P2_OPPONENT_LEFT);
						this._finishGame(parseInt(gameId), stateMachine.getOnlineState(), stateMachine.player2.intraName);
					}
					else {
						stateMachine.pauseGame(PausedReason.GAME_WON_P1_OPPONENT_LEFT);
						this._finishGame(parseInt(gameId), stateMachine.getOnlineState(), stateMachine.player1.intraName);
					}

					console.log(`Socket ${socketId} removed from game ${gameId} as ${intraName}`);
				}
			}
		}
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
			},
			onBeepSound: () => {},
			onBoopSound: ()	=> {},
			onGameStart: () => {
				console.log(`Game ${gameId} started`);
			},
			onImportantStateChange: (state: OnlineGameState) => {
				// console.log(`Sending game state update for game ${gameId} to room ${game.roomId} (players: ${game.players.map(p => p.intraName).join(', ')})`);
				this.gameGateway.server.to(game.roomId).emit('gameState', state);
			},
			onPaddleMoveChange: (paddleState: OnlinePaddleState) => {
				this.gameGateway.server.to(game.roomId).emit('gameState', this._games[gameId].stateMachine.getOnlineState());
			},
			onPlayerReady: (player: Player) => {
				this.gameGateway.server.to(game.roomId).emit('gameState', this._games[gameId].stateMachine.getOnlineState());
			},
			onGameOver: (state: OnlineGameState) => {
				this.gameGateway.server.to(game.roomId).emit('gameState', state);
				this._finishGame(gameId, state)
			}
		}, true);

		// Add the game to the internal games
		this._games[gameId] = {
			roomId: game.roomId,
			players: [ game.players[0].intraName, game.players[1].intraName ],
			sockets: {},
			stateMachine: gameStateMachine
		}
		return this._games[gameId];
	}

	async handlePaddleMovement(gameId: number, intraName: string, paddleState: OnlinePaddleState) {
		return new Promise<OnlineGameState>((resolve, reject) => {
			if (!this._games[gameId]) {
				console.warn("Trying to handle paddle movement for a game which is not running.");
				return reject('Game is not running');
			}
			if (!this._games[gameId].players.includes(intraName)) {
				console.warn(`User ${intraName} tried to send a paddle state for game ${gameId} but they are not in this game. In game: ${this._games[gameId].players}`);
				return reject('Unauthorized');
			}
			this._games[gameId].stateMachine.handleOnlinePaddleState(paddleState, null);
			resolve(this._games[gameId].stateMachine.getOnlineState());
		});
	}

	async handlePlayerReady(gameId: number, intraName: string) {
		console.log(`Handling playerReady event for game ${gameId} and user ${intraName}`);
		return new Promise<void>((resolve, reject) => {
			if (!this._games[gameId]) {
				console.warn("Trying to handle player ready for a game which is not running.");
				return reject('Game is not running');
			}
			if (!this._games[gameId].players.includes(intraName)) {
				console.warn(`User ${intraName} tried to send a player ready for game ${gameId} but they are not in this game. In game: ${this._games[gameId].players}`);
				return reject('Unauthorized');
			}
			this._games[gameId].stateMachine.handleOnlinePaddleState(null, intraName);
			resolve();
		});
	}

	/**
	 * Mark a game as finished and fill in the remaining data.
	 * @param gameId The ID of the game that has finished
	 * @param gameState The final game state
	 * @param forceWin The intraName of the user to force a win for, or null if no force win. Defaults to null.
	 */
	private async _finishGame(gameId: number, gameState: OnlineGameState, forceWin: string | null = null) {
		if (!this._games[gameId]) {
			console.warn(`Tried to finish game ${gameId} that was not running`);
			return;
		}

		console.log(`Finishing game ${gameId}`);

		// Calculate winner data
		let winnerUserId: number | null = null;
		let loserUserId: number | null = null;
		let victorScore: number | null = null;
		let loserScore: number | null = null;
		if (forceWin) {
			if (!this.userInGame(forceWin, gameId)) {
				console.warn(`Tried to force win for user ${forceWin} but they are not in game ${gameId}`);
				return;
			}
			winnerUserId = (gameState.players.player1.intraName == forceWin ? gameState.players.player1.id : gameState.players.player2.id);
			victorScore = (gameState.players.player1.intraName == forceWin ? gameState.players.player1.score : gameState.players.player2.score);
			loserUserId = (gameState.players.player1.intraName != forceWin ? gameState.players.player1.id : gameState.players.player2.id);
			loserScore = (gameState.players.player1.intraName != forceWin ? gameState.players.player1.score : gameState.players.player2.score);
		}
		else {
			if (gameState.players.player1.score > gameState.players.player2.score) {
				winnerUserId = gameState.players.player1.id;
				victorScore = gameState.players.player1.score;
				loserUserId = gameState.players.player2.id;
				loserScore = gameState.players.player2.score;
			}
			else if (gameState.players.player2.score > gameState.players.player1.score) {
				winnerUserId = gameState.players.player2.id;
				victorScore = gameState.players.player2.score;
				loserUserId = gameState.players.player1.id;
				loserScore = gameState.players.player1.score;
			}
			else {
				console.warn(`Game ${gameId} ended in a draw`);
				victorScore = gameState.players.player1.score;
				loserScore = gameState.players.player2.score;
			}
		}

		// Stop the game ticker
		this._ticker.remove(this._games[gameId].stateMachine.getTickerId());

		// Remove game from the cache
		delete this._games[gameId];

		// Finalize game data in DB
		await this.prismaService.game.update({
			where: { id: gameId },
			data: {
				status: GameStatus.ENDED,
				winnerId: winnerUserId,
				loserScore: loserScore,
				victorScore: victorScore
			}
		})

		// Update user stats
		if (winnerUserId && loserUserId) {
			await this.prismaService.user.update({
				where: { id: winnerUserId },
				data: {
					wins: { increment: 1 }
				}
			});
			await this.prismaService.user.update({
				where: { id: loserUserId },
				data: {
					losses: { increment: 1 }
				}
			});
		}
	}

}

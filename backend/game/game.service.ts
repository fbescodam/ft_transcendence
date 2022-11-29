import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Game, GameStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GameGateway } from './game.gateway';

/*==========================================================================*/

@Injectable()
export class GameService {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(forwardRef(() => GameGateway))
	private readonly gameGateway: GameGateway

	/**
	 * Add a user to the queue of users waiting for a game.
	 * @param intraName The intra name of the user to add to the queue
	 * @param id The socket id of the user to add to the queue
	 * @returns Returns true if the user was added to the queue, false on error
	 */
	async joinQueue(intraName: string, id: string): Promise<boolean> {
		try {
			await this.prismaService.queuedUser.create({
				data: {
					userName: intraName,
					socketId: id
				}
			});
			return true;
		}
		catch (e) {
			console.trace(e);
			return false;
		}
	}

	/**
	 * Remove a user from the queue of users waiting for a game.
	 * @param intraName The intra name of the user to remove from the queue
	 * @returns Returns true if the user was removed from the queue, false on error
	 */
	async leaveQueue(intraName: string): Promise<boolean> {
		try {
			await this.prismaService.queuedUser.delete({
				where: { userName: intraName }
			})
			return true;
		}
		catch (e) {
			console.trace(e);
			return false;
		}
	}

	/**
	 * Create a new game between two users.
	 * @param user1Name The intra name of the first user
	 * @param user2name The intra name of the second user
	 * @returns The newly created game. On error, use catch.
	 */
	async createGame(user1Name, user2name) {
		const game = await this.prismaService.game.create({
			data: {
				status: GameStatus.ONGOING,
				players: {
					connect: [
						{ intraName: user1Name },
						{ intraName: user2name }
					]
				},
				gameEvents: null,
				roomId: `game${user1Name}+${user2name}`
			}
		})
		return game;
	}

	/**
	 * Connect two players to the same game and start the game.
	 * @param game The game to start
	 * @param user1 The intra name of the first player
	 * @param user2 The intra name of the second player
	 */
	async startGame(game: Game, user1, user2) {
		this.gameGateway.server.to(user1.socketId).to(user2.socketId).emit('gameStart', {
			gameId: game.id,
			player1: user1.intraName,
			player2: user2.intraName //add whatever you need
		})
		this.gameGateway.server
			.to(user1.socketId)
			.to(user2.socketId)
			.socketsJoin(game.roomId); //cant find any docs about this function but i guess it does what the name implies
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
	 * Mark a game as finished and fill in the remaining data.
	 * @param gameId The ID of the game that has finished
	 * @param gameData An object defining who won the game including the scores
	 */
	async finishGame(gameId, gameData) {

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

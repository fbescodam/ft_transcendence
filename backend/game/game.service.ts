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

	//add user to queue
	async joinQueue(intraName: string, id: string) {
		await this.prismaService.queuedUser.create({
			data: {
				userName: intraName,
				socketId: id 
			}
		})
	}

	//user leaves queue
	async leaveQueue(intraName: string) {
		await this.prismaService.queuedUser.delete({
			where: {
				userName: intraName
			}
		})
	}

	//creates a game with the needed data
	async createGame(user1Name, user2name) {
		const game = await this.prismaService.game.create({
			data: {
				status: GameStatus.ONGOING,
				players: {
					connect: [
					{
						intraName: user1Name
					},
					{
						intraName: user2name
					}]
				},
				gameEvents: null,
				roomId: `game${user1Name}+${user2name}`
			}
		})
		return game
	}

	//start the game by telling the usere the game has started
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


	//add game event to array
	async updateGameEvents(gameId, gameEvent) {

		const game = await this.prismaService.game.findFirst({
			where: {id: gameId},
			include: {gameEvents: true}
		})
		await this.prismaService.game.update({
			where: {
				id: gameId
			},
			data: {
				gameEvents: {
					set: [...game.gameEvents, gameEvent]
				}
			}
		})
	}

	//game is over and all the final data gets filled in
	async finishGame(gameId, gameData) {

		await this.prismaService.game.update({
			where: {
				id: gameId
			},
			data: {
				winnerId: gameData["winnerId"],
				loserScore: gameData["loserScore"],
				victorScore: gameData["victoreScore"]
			}
		})
		

	}

}

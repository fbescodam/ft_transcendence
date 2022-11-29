import { Inject, Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";
import { GameService } from "./game.service";


const prisma = new PrismaClient()
const gameHandler = new GameService()
async function checkQueue() {
	const users = await prisma.queuedUser.findMany({
		orderBy: { joinedQueue: 'asc' },
		take: 2
	})

	if (users.length == 2) {
		//if 2 users are in queue: createGame -> leave queue -> startGame
		const game = await gameHandler.createGame(users[0].userName, users[1].userName)
		await gameHandler.leaveQueue(users[0].userName)
		await gameHandler.leaveQueue(users[1].userName)
		await gameHandler.startGame(game, users[0], users[1])
		//TODO: game loop somewhere
	}

}

@WebSocketGateway({ cors: { origin: "*", credentials: false } })
export class GameGateway {

	constructor() {
		(async () => {
			while (42) {
				checkQueue()
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
		})();
	}

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(GameService)
	private readonly gameService: GameService;

	@WebSocketServer()
	server;

	private readonly logger = new Logger("game");


	@UseGuards(JwtGuard)
	@SubscribeMessage('joinQueue')
	async joinQueue(@MessageBody() data: Object, @ConnectedSocket() socket: Socket) {
		await this.gameService.joinQueue(data["user"].intraName, socket.id)
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('leaveQueue')
	async leaveQueue(@MessageBody() data: Object) {
		await this.gameService.leaveQueue(data["user"].intraName)
	}


	@UseGuards(JwtGuard)
	@SubscribeMessage('finishGame')
	async finishGame() {

	}
}

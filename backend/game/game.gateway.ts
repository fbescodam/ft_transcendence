import { forwardRef, Inject, Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";
import { GameService } from "./game.service";

// normally we do not set origin to *, is unsafe
// however here we don't really have a domain, so we do not care
@WebSocketGateway({ cors: { origin: "*", credentials: false } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(forwardRef(() => GameService))
	private readonly gameService: GameService;

	@WebSocketServer()
	server;

	private readonly logger = new Logger("game");


	@UseGuards(JwtGuard)
	@SubscribeMessage('joinQueue')
	async joinQueue(@MessageBody() data: Object, @ConnectedSocket() socket: Socket) {
		const status = this.gameService.joinQueue(data["user"].intraName, socket.id)
		return { status: status }
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('leaveQueue')
	async leaveQueue(@MessageBody() data: Object) {
		const status = this.gameService.leaveQueue(data["user"].intraName)
		return { status: status }
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('getGame')
	async getGameInfo(@MessageBody() data: Object) {
		try {
			console.log(data);
			console.log("Fetching game data on game " + data["game"]["id"]);
			const game = await this.prismaService.game.findUnique({
				where: { id: data["game"]["id"] },
				include: { players: true }
			})
			return { game: game }
		}
		catch (e) {
			console.trace(e);
			return { error: e.toString() }
		}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('paddleGameState')
	async handlePaddleGameState(@MessageBody() data: Object) {
		try {
			return this.gameService.handlePaddleMovement(data["game"]["id"], data["user"]["intraName"], data["game"]["paddleState"]);
		}
		catch (e) {
			console.error(e);
			return { error: e.toString() };
		}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('playerReady')
	async handlePlayerReady(@MessageBody() data: Object) {
		try {
			return this.gameService.handlePlayerReady(data["game"]["id"], data["user"]["intraName"]);
		}
		catch (e) {
			console.error(e);
			return { error: e.toString() };
		}
	}


	@UseGuards(JwtGuard)
	@SubscribeMessage('setupGameConnection')
	async setupGameConnection(@MessageBody() data: Object, @ConnectedSocket() socket: Socket) {
		try {
			if (this.gameService.connectUserToGame(socket.id, data["user"]["intraName"], data["game"]["id"]))
				return { connectedToGame: true };
			return { connectedToGame: false };
		}
		catch (e) {
			console.error(e);
			return {error: e.toString()};
		}
	}

	handleConnection(@ConnectedSocket() socket: Socket) {

	}

	handleDisconnect(@ConnectedSocket() socket: Socket) {
		this.gameService.leaveQueue(socket.id);
		this.gameService.disconnectUserFromGames(socket.id);
	}
}

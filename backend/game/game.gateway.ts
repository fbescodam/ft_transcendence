import { Inject, Logger, UseGuards } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";


@WebSocketGateway({ cors: { origin: "*", credentials: false } })
export class GameGateway {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	
	@WebSocketServer()
	server;

	private readonly logger = new Logger("game");


	@UseGuards(JwtGuard)
	@SubscribeMessage('joinQueue') 
	async joinQueue() {
		


	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('leaveQueue') 
	async leaveQueue() {

	}




}
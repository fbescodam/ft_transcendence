import { Inject, Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";
import { FriendsService } from "./friends.service";

// do not set origin to *, is unsafe
// use localhost domain to connect to BreadPong instead of IP addresses.
@WebSocketGateway({ cors: { origin: "http://localhost:5173", credentials: false } })
export class FriendsGateway {

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(FriendsService)
	private readonly friendsService: FriendsService;

	@WebSocketServer()
	server;

	private readonly logger = new Logger("friends");

	@UseGuards(JwtGuard)
	@SubscribeMessage("removeFriend")
	public async removeFriend(@MessageBody() data: Object) {
		

	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("acceptFriendRequest")
	public async acceptFriendRequest(@MessageBody() data: Object) {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("denyFriendRequest")
	public async denyFriendRequest(@MessageBody() data: Object) {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("BlockUser")
	public async BlockUser(@MessageBody() data: Object) {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("unBlockUser")
	public async unBlockUser(@MessageBody() data: Object) {

	}

}

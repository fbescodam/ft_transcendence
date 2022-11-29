import { Inject, Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";
import { FriendsService } from "./friends.service";
import { User } from "svelte-hero-icons";

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
	@SubscribeMessage("getUserRelations")
	public async getUserRelations(@MessageBody() data: Object) {

		// const relations = this.prismaService.user.findFirst({
		// 	where: {
		// 		intraName: data["user"].intraName
		// 	},
		// 	include: {
		// 		relations: true
		// 	}
		// })

	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("sendFriendRequest")
	public async sendFriendRequest() {

	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("cancelFriendRequest")
	public async cancelFriendRequest() {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("removeFriend")
	public async removeFriend() {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("acceptFriendRequest")
	public async acceptFriendRequest() {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("denyFriendRequest")
	public async denyFriendRequest() {
		
	}
	
	@UseGuards(JwtGuard)
	@SubscribeMessage("BlockUser")
	public async BlockUser() {
		
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("unBlockUser")
	public async unBlockUser() {

	}

}

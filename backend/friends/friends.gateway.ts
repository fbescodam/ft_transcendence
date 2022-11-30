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
	@SubscribeMessage("addFriend")
	public async addFriend(@MessageBody() data: Object) {

		const otherUser = await this.prismaService.user.findFirst({
			where: {intraName: data["newFriend"]},
			include: {blocked: true}
		});

		if (otherUser.blocked.map((item) => item['intraName']).includes(data["user"].intraName))
			return {error: "you got blocked bitch"}
		
		const checkBlocked = await this.prismaService.user.findFirst({
			where: {intraName: data["user"].intraName},
			include: {blocked: true}
		});

		if (checkBlocked.blocked.map((item) => item['intraName']).includes(data["newFriend"]))
			await this.friendsService.unBlockUser(data["user"].intraName, data["newFriend"])

		await this.prismaService.user.update({
			where: {intraName: data["user"].intraName},
			data: {
				friends: {
					connect: {
						intraName: data["newFriend"]
					}
				}
			}
		});

		return {succes:"friend added"}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("removeFriend")
	public async removeFriend(@MessageBody() data: Object) {
		await this.friendsService.removeFriend(data["user"].intraName, data["removeFriend"])
		return {succes:"friend removed"}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("BlockUser")
	public async BlockUser(@MessageBody() data: Object) {
		
		const checkFriend = await this.prismaService.user.findFirst({
			where: {intraName: data["blockUser"]},
			include: {friends: true}
		})
		
		if (checkFriend.friends.map((item) => item['intraName']).includes(data["blockUser"]))
			await this.friendsService.removeFriend(data["user"].intraName, data["blockUser"])

		await this.prismaService.user.update({
			where: { intraName: data["user"].intraName },
			data: {
				blocked: {
					connect: {
						intraName: data["blockUser"]
					}
				}
			}
		});
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("unBlockUser")
	public async unBlockUser(@MessageBody() data: Object) {
		await this.friendsService.unBlockUser(data["user"].intraName, data["unBlockUser"])
		return {succes:"user unblocked"}
	}

}

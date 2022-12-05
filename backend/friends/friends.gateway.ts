import { Inject, Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Socket } from "socket.io";
import { JwtGuard } from "auth/Guard";
import { PrismaService } from "prisma/prisma.service";
import { FriendsService } from "./friends.service";

// normally we do not set origin to *, is unsafe
// however here we don't really have a domain, so we do not care
@WebSocketGateway({ cors: { origin: "*", credentials: false } })
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
		try {
			const otherUser = await this.prismaService.user.findFirst({
				where: {intraName: data["newFriend"]},
				include: {blocked: true}
			});

			if (otherUser &&
				otherUser.blocked.map((item) => item['intraName']).includes(data["user"].intraName))
				return {error: "you got blocked by this user, or you blocked them"}

			const checkBlocked = await this.prismaService.user.findFirst({
				where: {intraName: data["user"].intraName},
				include: {blocked: true}
			});

			if (checkBlocked.blocked.map((item) => item['intraName']).includes(data["newFriend"]))
				await this.friendsService.unBlockUser(data["user"].intraName, data["newFriend"])

			await this.friendsService.addFriend(data["user"].intraName, data["newFriend"])

			return {succes:"friend added"}
		}
		catch (e) {
			console.error(e);
			return {error: e.toString()};
		}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("removeFriend")
	public async removeFriend(@MessageBody() data: Object) {
		try {
			await this.friendsService.removeFriend(data["user"].intraName, data["removeFriend"])
			return {succes:"friend removed"}
		}
		catch (e) {
			console.error(e);
			return {error: e.toString()};
		}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("blockUser")
	public async BlockUser(@MessageBody() data: Object) {
		try {
			const checkFriend = await this.prismaService.user.findFirst({
				where: {intraName: data["blockUser"]},
				include: {friends: true}
			})

			const user = await this.prismaService.user.findFirst({
				where: {intraName: data["user"].intraName},
				select: {
					blocked: true,
					blockedWho: true,
					friends: true
				}
			})

			if (checkFriend.friends.map((item) => item['intraName']).includes(data["user"].intraName))
				await this.friendsService.removeFriend(data["user"].intraName, data["blockUser"])

			await this.friendsService.blockUser(data["user"].intraName, data["blockUser"])
			user.blockedWho.push(data["blockUser"])
			await this.prismaService.user.update({
				where: {intraName: data["user"].intraName},
				data : {
					blockedWho: {
						set: user.blockedWho
					}
				}
			})
			return {succes:"user blocked"}
		}
		catch (e) {
			console.error(e);
			return {error: e.toString()};
		}
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("unBlockUser")
	public async unBlockUser(@MessageBody() data: Object) {
		try {
			const otherUser = await this.prismaService.user.findFirst({
				where: {intraName: data["blockUser"]},
				select: {
					blocked: true,
					blockedWho: true,
				}
			})
			if (data["user"].intraName in otherUser.blockedWho)
				return {error:"you were blocked"}
			await this.friendsService.unBlockUser(data["user"].intraName, data["unBlockUser"])

			const user = await this.prismaService.user.findFirst({
				where: {intraName: data["user"].intraName},
				select: {
					blockedWho: true,
				}
			})
			await this.prismaService.user.update({
				where: {intraName: data["user"].intraName},
				data : {
					blockedWho: {
						set: user.blockedWho.filter((val) => val != data["unBlockUser"])
					}
				}
			})

			return {succes:"user unblocked"}
		}
		catch (e) {
			console.error(e);
			return {error: e.toString()};
		}
	}
}

import fetch from "node-fetch";
import { Socket } from "socket.io";
import * as JWT from "jsonwebtoken"
import { JwtGuard } from "auth/Guard";
import { prisma, Role } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
	WsResponse,
} from "@nestjs/websockets"
import * as fs from 'fs';
import * as dotenv from 'dotenv'

/*==========================================================================*/

dotenv.config();

/** TODO: What is this GateWay? Some refs or docs please... */
@WebSocketGateway({ cors: { origin: "*", credentials: false } })
export class MainGateway {

	//= Properties =//

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;

	@WebSocketServer()
	server;

	private readonly logger = new Logger("sockets");

	//= Methods =//
	@UseGuards(JwtGuard)
	OnGatewayConnection() {

	}

	/**
	 * Hanlder for messages that are being sent.
	 * @param msg The message that was sent.
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage('sendMsg')
	async handleMessage(@MessageBody() msg: any): Promise<void> {
	 this.server.to(msg.inChannel).emit('sendMsg', {text: msg.text, user:msg.user.name, channel:msg.inChannel});
	 this.logger.log(`sent ${msg.text} to ${msg.inChannel} by ${msg.user.name}`);
	 await this.prismaService.message.create({data: {
		senderName: msg.user.intraName,
		channelName: msg.inChannel,
		text: msg.text
	 }});
	}


	/**
	 * TODO: Figure out the correct types...
	 *
	 * Retrieves the channels for a given user.
	 * @param userName The name of the user.
	 * @returns All the channels that the user is subscribed to.
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage('getChannelsForUser')
	async getChannelsForUser(@MessageBody() data: any) {
	const user = await this.prismaService.user.findFirst({
		where: { name: data.user.intraName },
		include: { channels: true }})
	return user.channels;
	}

	/**
	 * Retrieves the messages in a channel.
	 * @param channelName The channel name
	 * @returns All the messages in the channel.
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage('getMessagesFromChannel')
	async getMessagesFromChannel(@MessageBody() name: any) {
	const channel = await this.prismaService.channel.findFirst({
		where: {name: name.name },
		include: { messages: true}
	})
	return channel.messages;
}


	//TODO: figure out why messages get sent to every socket
	@SubscribeMessage("joinRooms")
	joinRooms(@MessageBody() roomInfo: string[], @ConnectedSocket() socket: Socket) {
		socket.join(roomInfo["channels"]);
		this.logger.log(`joined ${roomInfo["channels"]}`);
	}

	@SubscribeMessage("leaveRoom")
	leaveRoom(@MessageBody() roomInfo: { name: string }, @ConnectedSocket() socket: Socket) {
		socket.leave(roomInfo.name);
		this.logger.log(`left ${roomInfo.name}`);
	}

	/**
	 * Creates a new channel.
	 * @param channelData The channel data. E.g: Name, public or private, password ...
	 * @param socket The web socket that is the client.
	 * @returns The newly created channel.
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("createChannel")
	public async createChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {

		const channelExists = await this.prismaService.channel.findUnique({
			where: {
				name:channelData["name"]
			}
		});

		if (channelExists)
		{
			this.logger.log(`channel named ${channelData["name"]} exists`)
			return {error:"channel exists"}
		}

		const channel = await this.prismaService.channel.create({
			data: {
				name: channelData["name"],
				password: channelData["password"] || null, //TODO: hash these mofos
				users: {
					create: {
					role: Role.ADMIN,
					userName: channelData["user"].intraName,
					}
				}
			}
		});

		socket.join(channelData["name"]) //TODO: for some reason this dont do shit
		this.logger.log(`${channelData["user"].intraName} created and joined ${channelData["name"]}`)
		return channel
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("joinChannel")
	public async joinChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {
		const channel = await this.prismaService.channel.findUnique({
			where: {
				name:channelData["name"]
			}
		});

		if (!channel)
			return {error:"channel does not exist"}
		if (channel.password && channel.password != channelData["password"])
			return {error:"wrong password"}

		await this.prismaService.channel.update({
			where: {
				name: channelData["name"]
			},
			data: {
				users: {
					create: {
						role: Role.USER,
						userName: channelData["user"].intraName,
					}
				}
			}
		});

		socket.join(channelData["name"])
		return {name:channelData["name"]}
	}

	@SubscribeMessage("leaveChannel")
	public async leaveChannel(@MessageBody() channelData: Object) {

	}

	@SubscribeMessage("sendFriendRequest")
	sendFriendRequest(@MessageBody() UserInfo: Object) {

	}

	@SubscribeMessage("unFriendUser")
	unFriendUser(@MessageBody() UserInfo: Object) {

	}

	/**
	 * Main authenticaton function to authenticate a user with the 42 OAuth webflow.
	 * @param data Data.
	 * @param socket The websocket.
	 * @returns
	 */
	@SubscribeMessage("authStart")
	public async authStart(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {
		this.logger.log(data);

		// Fetch the oauth token.
		const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			body: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: process.env.INTRA_KEY,
				client_secret: process.env.INTRA_SECRET,
				code: data["authCode"],
				state: data["state"],
				redirect_uri: "http://localhost:5173/auth"
			}),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			}
		});
		if (!response.ok) {
			this.logger.log(`Failed to authenticate: ${response.status} : ${response.statusText}`);
			return { error: response.statusText }
		}

		// Fetch all user data from /me
		const authResponse = await response.json();
		const responseUser = await fetch("https://api.intra.42.fr/v2/me", {
			method: "GET",
			headers: {
				"Authorization": `Bearer ${authResponse["access_token"]}`,
				"Content-Type": "application/json"
			}
		});
		const userResponse = await responseUser.json();

		// Registration
		// these things should only be done on first-time login
		const userExists = await this.prismaService.user.count({
			where: {
				intraId: userResponse["id"]
			}
		});
		const avatarFile = `avatars/${userResponse["id"]}`;
		if (!userExists) {
			const profilePic = await fetch(userResponse["image"]["versions"]["large"]);
			const fileStream = fs.createWriteStream(`static/${avatarFile}`);
			await new Promise((resolve, reject) => {
				profilePic.body.pipe(fileStream);
				profilePic.body.on("error", reject);
				fileStream.on("finish", resolve);
			});
		}

		// Store user data with upsert, if user already exists this does nothing
		const userData = await this.prismaService.user.upsert({
			where: {
				intraId: userResponse["id"]
			},
			update: {}, // Empty since if user exists already all this data should be there
			create:
			{
				name: userResponse["login"],
				email: userResponse["email"],
				intraId: userResponse["id"],
				intraName: userResponse["login"],
				avatar: avatarFile,
				channels: {
					create: {
						role: Role.USER,
						channel: {
							connect: {
								name: "Global"
							}
						}
					}
				}
			}
		});

		//sign a jwttoken and store it in the auth of the socket handshake
		const jwtToken = JWT.sign(userData, process.env.JWT_SECRET);

		socket.handshake.auth = { token: jwtToken }
		return { token: jwtToken, state: data["state"], displayName:userResponse["login"] }; // <===== jwt
	}
}

/*==========================================================================*/

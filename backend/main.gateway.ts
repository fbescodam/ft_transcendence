import fetch from "node-fetch";
import { Socket } from "socket.io";
import * as JWT from "jsonwebtoken"
import { JwtGuard } from "auth/Guard";
import { ChannelType, Role } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
} from "@nestjs/websockets"
import * as fs from 'fs';
import * as dotenv from 'dotenv'
import { TwoFactorAuthenticationService } from "auth/2fa.service";

/*==========================================================================*/

dotenv.config();

// do not set origin to *, is unsafe
// use localhost domain to connect to BreadPong instead of IP addresses.
@WebSocketGateway({ cors: { origin: "http://localhost:5173", credentials: false } })
export class MainGateway {

	//= Properties =//

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(TwoFactorAuthenticationService)
	private readonly tfaService: TwoFactorAuthenticationService;


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
		this.server.to(msg.inChannel).emit('sendMsg', { text: msg.text, user:msg.user.name, channel:msg.inChannel });
		this.logger.log(`sent ${msg.text} to ${msg.inChannel} by ${msg.user.name}`);
		await this.prismaService.message.create({
			data: {
				senderName: msg.user.intraName,
				channelName: msg.inChannel,
				text: msg.text
			}
		});
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
			include: { channels: true }
		});
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
		include: { messages: true }
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
			where: { name:channelData["name"] }
		});

		if (channelExists) {
			this.logger.log(`channel named ${channelData["name"]} exists`)
			return { error:"channel exists" }
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
	@SubscribeMessage("createDirectChannel")
	public async createDirectChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {

		const newChannelName = channelData["user1"].name + "-" + channelData["user2"].name
		const channelExists = await this.prismaService.channel.findUnique({
			where: { name:newChannelName }
		});

		if (channelExists) {
			this.logger.log(`direct channel named ${channelData["name"]} exists`)
			return {error:"direct channel exists"}
		}

		//TODO: verify users exist
		const channel = await this.prismaService.channel.create({
			data: {
				name: newChannelName,
				type: ChannelType.DIRECT,
				password: null,
				users: {
					create: [
						{
							userName: channelData["user1"].name,
							role: Role.ADMIN
						},
						{
							userName: channelData["user2"].name,
							role: Role.ADMIN
						}
					]
				}
			}
		});

		socket.join(newChannelName)
		this.logger.log(`direct messages between ${channelData["user1"].name} and ${channelData["user2"].name} established`)
		return channel
	}


	@UseGuards(JwtGuard)
	@SubscribeMessage("joinChannel")
	public async joinChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {
		const channel = await this.prismaService.channel.findUnique({
			where: { name:channelData["name"] }
		});

		if (!channel)
			return {error:"channel does not exist"}
		if (channel.password && channel.password != channelData["password"])
			return {error:"wrong password"}

		await this.prismaService.channel.update({
			where: { name: channelData["name"] },
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
		return { name: channelData["name"] }
	}

	@SubscribeMessage("leaveChannel")
	public async leaveChannel(@MessageBody() channelData: Object) {

	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("changeDisplayName")
	async changeDisplayName(@MessageBody() UserInfo: Object) {
		//TODO: NEW JWTTOKEN
		const user = await this.prismaService.user.findFirst({
			where: { name: UserInfo["user"].name }
		})

		// if (user)
		// 	return {error:"Username already in use"}

		await this.prismaService.user.update({
			where: { intraName: UserInfo["user"].intraName },
			data: { name: UserInfo["newDisplayName"] }
		})

		this.logger.log(`changed ${UserInfo["user"].name} to ${UserInfo["newDisplayName"]}`)

		return { newName: UserInfo["newDisplayName"] };
	}

	@SubscribeMessage("verifyJWT")
	verifyJwt(@ConnectedSocket() socket: Socket) {
		try {
			JWT.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
		}
		catch (e) {
			return { status: "sad" }
		}
		return { status: "ok" }
	}

	/**
	 * sets a 2fa secret for user and returns a qrcode to scan with an authenticator app
	 * @param data empty object
	 * @returns new jtwToken and qrcode as an svg element (<svg ....>)
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("getQrCode")
	public async tfaAuth(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {
		const { otpauthUrl, newUser } = await this.tfaService.generateTwoFactorAuthenticationSecret(data["user"]);


		const jwtToken = JWT.sign(newUser, process.env.JWT_SECRET);
		socket.handshake.auth = { token: jwtToken }

		this.logger.log(jwtToken)
		const ret = await this.tfaService.pipeQrCodeStream(otpauthUrl)
		return { token: jwtToken, qrcode: ret }
	}

	//TODO: 2fa flow. user logs in -> check if 2fa is enabled -> log user in or redirect them to 2fa flow

	/**
	 * checks wether or not a submitted 2fa code is valid
	 * @param data contains tfa code
	 * @returns valid or invalid
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("checkCode")
	public async checkCode(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {
		const valid = this.tfaService.isTwoFactorAuthenticationCodeValid(data["tfaCode"], data["user"])
		if (!valid)
			return {error:"invalid 2fa"}
		return { valid: "2fa code is valid" }
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("isTfaEnabled")
	public async tfaEnabled(@MessageBody() data: object) {
		return { tfaEnabled: data["user"].tfaEnabled };
	}

	/**
	 * enables 2fa authentication for user (flips a boolen in db)
	 * @param data contains tfa code
	 * @returns new jwttoken
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("enableTfaAuth")
	public async enableTfaAuth(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {

		const user = await this.prismaService.user.update({
			where: { intraName: data["user"].intraName },
			data: { tfaEnabled: true }
		})
		this.logger.log(`tfa enabled for ${user.intraName}`)
		const jwtToken = JWT.sign(user, process.env.JWT_SECRET);
		socket.handshake.auth = { token: jwtToken }
		return { token: jwtToken }
	}

	/**
	 * disables 2fa authentication for user (flips a boolen in db)
	 * @param data contains tfa code
	 * @returns new jwttoken
	*/
	@UseGuards(JwtGuard)
	@SubscribeMessage("disableTfaAuth")
	public async disableTfaAuth(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {
		const valid = this.tfaService.isTwoFactorAuthenticationCodeValid(data["tfaCode"], data["user"])
		if (!valid)
			return { error: "invalid 2fa" }

		const user = await this.prismaService.user.update({
			where: { intraName: data["user"].intraName },
			data: { tfaEnabled: false }
		})
		this.logger.log(`tfa disabled for ${user.intraName}`)
		const jwtToken = JWT.sign(user, process.env.JWT_SECRET);
		socket.handshake.auth = { token: jwtToken }
		return { token: jwtToken }
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
			where: { intraId: userResponse["id"] }
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
			where: { intraId: userResponse["id"] },
			update: {}, // Empty since if user exists already all this data should be there
			create: {
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
		return { token: jwtToken, state: data["state"], displayName: userData.name, avatar: userData.avatar }; // <===== jwt
	}
}

/*==========================================================================*/

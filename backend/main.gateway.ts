import fetch from "node-fetch";
import { Server } from "typeorm";
import { Socket } from "socket.io";
import * as JWT from "jsonwebtoken"
import { JwtGuard } from "auth/Guard";
import { Role } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { Inject, Logger, UseGuards } from "@nestjs/common";
import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
	WsResponse,
} from "@nestjs/websockets";

/*==========================================================================*/

/** TODO: What is this GateWay? Some refs or docs please... */
@WebSocketGateway({ cors: { origin: "*", credentials: false } })
export class MainGateway {

	//= Properties =//

	@Inject(PrismaService)
	private readonly prismaService: PrismaService;

	@WebSocketServer()
	server: Server;

	private readonly logger = new Logger("sockets");

	//= Methods =//

	/**
	 * Hanlder for messages that are being sent.
	 * @param msg The message that was sent.
	 */
   @UseGuards(JwtGuard)
   @SubscribeMessage('sendMsg')
   async handleMessage(@MessageBody() msg: any): Promise<void> {
     this.server.emit('sendMsg', {text: msg.text, user:msg.user.name, channel:msg.inChannel});
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
    this.logger.log(user);
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
 

	@SubscribeMessage("joinRooms")
	joinRooms(@MessageBody() roomInfo: string[], @ConnectedSocket() socket: Socket) {
		socket.join(roomInfo);
		this.logger.log(`joined ${roomInfo}`);
	}

	@SubscribeMessage("leaveRoom")
	leaveRoom(@MessageBody() roomInfo: { name: string }, @ConnectedSocket() socket: Socket) {
		socket.leave(roomInfo.name);
		this.logger.log(`left ${roomInfo.name}`);
	}

  @UseGuards(JwtGuard)
	@SubscribeMessage("createChannel")
	public async createChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {

    await this.prismaService.channel.create({ data: {
      name: channelData["name"],
      password: channelData["password"] || null,
      users: {
        connect: {
          userName_channelName: {
            userName: channelData["user"].intraName,
            channelName: channelData["name"]
    }}}}});
    socket.join(channelData["name"])
    this.logger.log(`${channelData["user"].intraName} created and joined ${channelData["name"]}`)

	}

  @SubscribeMessage("enterChannel")
	public async enterChannel(@MessageBody() channelData: Object) {

	}

	@SubscribeMessage("leaveChannel")
	public async leaveChannel(@MessageBody() channelData: Object) {

	}


	// @SubscribeMessage("createUser")
	// async createUser(@MessageBody() userData: any): Promise<void> {
	//   await this.prismaService.user.create({data: {
	//     name: userData.name,
	//     password: userData.password,
	//     channels: { create:
	//       {
	//         role: Role.USER,
	//         channel: {connect: {name: "Global"}}
	//       }
	//   }}})
	// }

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

		// Store user data with upsert, if user already exists this does nothing
		const userData = await this.prismaService.user.upsert({
			where: {
				intraId: userResponse["id"]
			},
			update: {}, // Empty since if user exists already all this data should be there 
			create:
			{
				name: userResponse["login"],
				intraId: userResponse["id"],
				intraName: userResponse["login"],
				avatar: "https://freekb.es/imgs/project-meirlbot-icon.png",
				channels: {
					create:
					{
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
		return { token: jwtToken, state: data["state"] }; // <===== jwt
	}
}

/*==========================================================================*/

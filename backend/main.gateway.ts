import fetch from "node-fetch";
import { Socket } from "socket.io";
import * as JWT from "jsonwebtoken"
import { JwtGuard } from "auth/Guard";
import { ChannelType, Role, UserInChannel } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";
import { Inject, Logger, UseGuards, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from 'cache-manager'
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
import { AppService } from "app.service";

/*==========================================================================*/

dotenv.config();

// normally we do not set origin to *, is unsafe
// however here we don't really have a domain, so we do not care
@WebSocketGateway({ cors: { origin: "*", credentials: false } })
export class MainGateway {

	//= Properties =//

	@Inject(AppService)
	private readonly appService: AppService;
	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	@Inject(TwoFactorAuthenticationService)
	private readonly tfaService: TwoFactorAuthenticationService;

	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	@WebSocketServer()
	server;

	private readonly logger = new Logger("sockets");

	//= Methods =//
	@UseGuards(JwtGuard)
	OnGatewayConnection() {
		console.log("new socket connected")
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("getUserData")
	public async getUserData(@MessageBody() data: object) {
		this.logger.log(`getting user data for ${data["penis"]}`);
		const user = await this.prismaService.user.findFirst({
			where: {
				name: data["penis"]
			},
			select: {
				name: true,
				intraName: true,
				wins: true,
				losses: true,
				avatar: true,
				games: {
					select: {
						players: {
							select: {
								avatar: true,
								name: true
							}
						},
						loserScore: true,
						winnerId: true,
						victorScore: true,
						createdAt: true
					}
				},
				friends: true,
				blocked: true,
				blockedWho: true
			}
		});

		if (!user)
			return { error: "no user found" };
		return user;
	}

	/**
	 * Hanlder for messages that are being sent.
	 * @param msg The message that was sent.
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage('sendMsg')
	async handleMessage(@MessageBody() msg: any): Promise<void> {
		this.server.to('chan-' + msg.inChannel).emit('sendMsg', { text: msg.text, user:msg.user.name, channel:msg.inChannel });
		this.logger.log(`sent ${msg.text} to ${msg.inChannel} by ${msg.user.name}`);
		await this.prismaService.message.create({
			data: {
				senderName: msg.user.name,
				channelName: msg.inChannel,
				text: msg.text
			}
		});
	}

	/**
	 * get all blocked users
	 * @param data {}
	 * @returns all blocked users
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage('getBlockedUsers')
	async getBlockedUser(@MessageBody() data: any) {
		const user = await this.prismaService.user.findFirst({
			where: { intraName: data.user.intraName },
			select: {
				blocked: {
					select: {
						name: true
					}
				}
			}
		});
		return user.blocked;
	}

	/**
	 * Retrieves the channels for a given user.
	 * @param userName The name of the user.
	 * @returns All the channels that the user is subscribed to.
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage('getChannelsForUser')
	async getChannelsForUser(@MessageBody() data: any) {
		const user = await this.prismaService.user.findFirst({
			where: { intraName: data.user.intraName },
			include: { channels: true }
		});
		return user.channels;
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage('getUsersInChannel')
	async getUsersInChannel(@MessageBody() data: any) {
		//check user is admin
		const userInChannel = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["user"].intraName
					}
				}
			}
		}) //TODO: this could be a guard i guess

		if (!userInChannel)
			return {error:"not part of channel"};
		if (userInChannel.users[0].role != Role.ADMIN && userInChannel.users[0].role != Role.OWNER)
			return {error:"not an admin"};

		const channelUsers = await this.prismaService.channel.findFirst({
			where: { name: data["channelName"]},
			select: {
				users: {
					select: {
						userName: true,
						joinedOn: true,
						role: true
					}
				}
			}
		})

		return {usersInChannel:channelUsers}
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

	@UseGuards(JwtGuard)
	@SubscribeMessage('checkDmExistence')
	async checkDmExistence(@MessageBody() data: any) {

		let arr = [data["user"].intraName, data["user2"]]
		arr.sort() //yes this is cringe, no i will not change it
		let channelName = arr[0] + '-' + arr[1]

		const user = await this.prismaService.user.findFirst({
			where: {intraName: data["user"].intraName},
			include: {channels: true}
		})

		let foundChannel = null
		for (let i = 0; i < user.channels.length; i++) {
			const element = user.channels[i];
			if (element.channelName == channelName)
				foundChannel = element.channelName
		}

		this.logger.log("dms exist already")
		return {channel:foundChannel}
	}


	@SubscribeMessage("joinRooms")
	async joinRooms(@MessageBody() roomInfo: string[], @ConnectedSocket() socket: Socket) {

		roomInfo["channels"] = roomInfo["channels"].map(i => 'chan-' + i);
		await socket.join(roomInfo["channels"]);
		this.logger.log(`joined ${roomInfo["channels"]}`);
	}

	@SubscribeMessage("leaveRoom")
	async leaveRoom(@MessageBody() roomInfo: { name: string }, @ConnectedSocket() socket: Socket) {
		await socket.leave(roomInfo.name);
		this.logger.log(`left ${roomInfo.name}`);
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("createDirectChannel")
	public async createDirectChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {

		let arr = [channelData["user"].intraName, channelData["user2"]]
		arr.sort() //yes this is cringe, no i will not change it
		const newChannelName = arr[0] + "-" + arr[1]
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
				password: undefined,
				users: {
					create: [
						{
							userName: arr[0],
							role: Role.OWNER
						},
						{
							userName: arr[1],
							role: Role.OWNER
						}
					]
				}
			}
		});

		await socket.join('chan-' + newChannelName)
		this.logger.log(`direct messages between ${channelData["user"].intraName} and ${channelData["user2"]} established`)
		return channel
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

		let channel;
		if (channelData["password"] != null)
		{
			const password = await this.appService.hashPassword(channelData["password"])
			channel = await this.prismaService.channel.create({
				data: {
					name: channelData["name"],
					password: { create: { string: password } },
					users: { create: { role: Role.OWNER, userName: channelData["user"].intraName } }
				}
			});
		}
		else
		{
			channel = await this.prismaService.channel.create({
				data: {
					name: channelData["name"],
					password: undefined,
					users: { create: { role: Role.OWNER, userName: channelData["user"].intraName } }
				}
			});
		}

		await socket.join('chan-' + channelData["name"]);
		this.logger.log(`${channelData["user"].intraName} created and joined ${channelData["name"]}`)
		return channel
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("removePassword")
	public async removepassword(@MessageBody() data: Object) {

		//check user is admin
		const userInChannel = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["user"].intraName
					}
				}
			}
		}) //TODO: this could be a guard i guess
		if (userInChannel.users[0].role != Role.ADMIN && userInChannel.users[0].role != Role.OWNER)
			return {error:"not an admin"};

		try {
			await this.prismaService.channel.update({
				where: {name: data["name"]},
				data: {password: {delete: true}}
			})
		}
		catch(any) { this.logger.log("no password")}

		this.logger.log(`removed password of ${data["name"]}`)
		return {valid: "password removed"}
	}

	//TODO: do these need admin verification?

	@UseGuards(JwtGuard)
	@SubscribeMessage("changePassword")
	public async changePassword(@MessageBody() data: Object) {

		//check user is admin
		const userInChannel = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["user"].intraName
					}
				}
			}
		}) //TODO: this could be a guard i guess
		if (userInChannel.users[0].role != Role.ADMIN && userInChannel.users[0].role != Role.OWNER)
			return {error:"not an admin"};

		const newPass = await this.appService.hashPassword(data["password"])
		try {
			await this.prismaService.channel.update({
				where: {name: data["name"]},
				data: {password: {delete: true}}
			})
		}
		catch(any) { this.logger.log("no password, adding one")}

		const channel = await this.prismaService.channel.update({
			where: {name: data["name"]},
			data: {password: {create: {string: newPass}}},
		})

		this.logger.log(`changed password of ${channel.name}`)
		return {valid:"password changed"}
	}


	@UseGuards(JwtGuard)
	@SubscribeMessage("joinChannel")
	public async joinChannel(@MessageBody() channelData: Object, @ConnectedSocket() socket: Socket) {
		const channel = await this.prismaService.channel.findUnique({
			where: { name:channelData["name"] },
			select: {password: true, users: true, type: true}
		});

		if (!channel)
			return {error:"channel does not exist"};
		if (channel.type == ChannelType.DIRECT)
			return {error:"direct channel"}
		if (channel.password &&
			channel.password.string &&
			await this.appService.comparePassword(channel.password.string, channelData["password"]) == false)
			return {error:"wrong password"};
		if (channel.users.map((item) => item['userName']).includes(channelData["user"].intraName))
			return {error:"already in channel"};

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

		await socket.join('chan-' + channelData["name"])
		return { name: channelData["name"] }
	}

	/**
	 * method for admin a user in chanel
	 * @param data {channelName: channel_to_admin_in, adminUser: user_to_admin}
	 * @returns
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("makeUserAdmin")
	public async makeUserAdmin(@MessageBody() data: Object) {

		//check user is admin
		const userInChannel = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["user"].intraName
					}
				}
			}
		}) //TODO: this could be a guard i guess

		if (!userInChannel)
			return {error:"not part of channel"};
		if (userInChannel.users[0].role != Role.ADMIN && userInChannel.users[0].role != Role.OWNER)
			return {error:"not an admin"};
		if (userInChannel.users[0].userName == data["adminUser"].intraName)
			return {error:"can't admin yourself"};

		await this.prismaService.channel.update({
			where: { name:data["channelName"] },
			data: {
				users: {
					updateMany: {
						where: { userName: data["adminUser"]  },
						data: {
							role: Role.ADMIN
						}
					}
				}
			}
		})

		this.logger.log(`${data["adminUSer"]} made admin in ${data["channelName"]}`)
	}

	/**
	 * method for muting a user in chanel
	 * @param data {channelName: channel_to_mute_in, muteUser: user_to_mute}
	 * @returns
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("muteUser")
	public async muteUser(@MessageBody() data: Object) {

		//check user is admin
		const userInChannel = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["user"].intraName
					}
				}
			}
		})

		if (!userInChannel)
			return {error:"not part of channel"};
		if (userInChannel.users[0].role != Role.ADMIN && userInChannel.users[0].role != Role.OWNER)
			return {error:"not an admin"};
		if (userInChannel.users[0].userName == data["muteUser"].intraName)
			return {error:"can't mute yourself"};

		await this.prismaService.channel.update({
			where: { name:data["channelName"] },
			data: {
				users: {
					updateMany: {
						where: { userName: data["muteUser"]  },
						data: {
							role: Role.MUTED
						}
					}
				}
			}
		})

		this.logger.log(`${data["muteUser"]} muted in ${data["channelName"]}`)
	}

	/**
	 * method to kick user from channel
	 * @param data {channelName: channel_to_kick_in, kickUser: user_to_kick}
	 * @returns
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("kickUser")
	public async kickUser(@MessageBody() data: Object) {


		//check user is admin
		const userInChannel = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["user"].intraName
					}
				}
			}
		})

		if (!userInChannel)
			return {error:"not part of channel"};
		if (userInChannel.users[0].role != Role.ADMIN && userInChannel.users[0].role != Role.OWNER)
			return {error:"not an admin"};
		if (data["user"].intraName == data["kickUser"])
			return {error:"can't kick yourself"};

		// check if user to kick is owner
		const userToKick = await this.prismaService.channel.findUnique({
			where: { name:data["channelName"] },
			select: {
				users: {
					where: {
						userName: data["kickUser"]
					}
				}
			}
		})
		if (userToKick.users[0].role == Role.OWNER)
			return {error:"can't kick owner"};

		await this.prismaService.channel.update({
			where: {name: data["channelName"]},
			data: {
				users: {
					deleteMany: [{ userName: data["kickUser"]}],
				}
			}
		})
	}

	/**
	 * method for a 'leave channel' button
	 * @param channelData {name: name_of_channel}
	 * @returns
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("leaveChannel")
	public async leaveChannel(@MessageBody() data: Object) {

		const channel = await this.prismaService.channel.findUnique({
			where: { name:data["name"] },
			select: {users: true}
		});

		if (!channel)
			return {error:"channel does not exist"};

		await this.prismaService.channel.update({
			where: {name: data["name"]},
			data: {
				users: {
					deleteMany: [{ userName: data["user"].intraName }],
				}
			}
		})

		//TODO: if the last admin left a new admin should be selected
		//TODO: other logic probably idk yet what

		this.logger.log(`${data["user"].intraName} left ${data["name"]}`)
	}

	@UseGuards(JwtGuard)
	@SubscribeMessage("changeDisplayName")
	async changeDisplayName(@MessageBody() UserInfo: Object, @ConnectedSocket() socket: Socket) {
		const user = await this.prismaService.user.findFirst({
			where: { name: UserInfo["newDisplayName"] }
		})

		if (user)
			return {error:"Username already in use"}

		const newUser = await this.prismaService.user.update({
			where: { intraName: UserInfo["user"].intraName },
			data: { name: UserInfo["newDisplayName"] }
		})

		await this.prismaService.message.updateMany({
			where: {
				senderName: UserInfo["user"].name
			},
			data: {
				senderName: newUser.name
			}
		})

		this.logger.log(`changed ${UserInfo["user"].name} to ${UserInfo["newDisplayName"]}`)

		const jwtToken = JWT.sign(newUser, process.env.JWT_SECRET);
		await this.cacheManager.del(socket.handshake.auth.token)
		socket.handshake.auth = { token: jwtToken }
		return { token: jwtToken, newName: UserInfo["newDisplayName"] };
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
		await this.cacheManager.del(socket.handshake.auth.token)
		socket.handshake.auth = { token: jwtToken }

		this.logger.log(jwtToken)
		const ret = await this.tfaService.pipeQrCodeStream(otpauthUrl)
		return { token: jwtToken, qrcode: ret }
	}

	/**
	 * checks wether or not a submitted 2fa code is valid
	 * @param data contains tfa code
	 * @returns valid or invalid
	 */
	@UseGuards(JwtGuard)
	@SubscribeMessage("checkCode")
	public async checkCode(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {
		const valid = await this.tfaService.isTwoFactorAuthenticationCodeValid(data["authCode"], data["user"])
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

		const valid = await this.tfaService.isTwoFactorAuthenticationCodeValid(data["tfaCode"], data["user"])
		if (!valid)
			return { error: "invalid 2fa" }

		const user = await this.prismaService.user.update({
			where: { intraName: data["user"].intraName },
			data: { tfaEnabled: true }
		})
		this.logger.log(`tfa enabled for ${user.intraName}`)
		const jwtToken = JWT.sign(user, process.env.JWT_SECRET);
		await this.cacheManager.del(socket.handshake.auth.token)
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
		const valid = await this.tfaService.isTwoFactorAuthenticationCodeValid(data["tfaCode"], data["user"])
		if (!valid)
			return { error: "invalid 2fa" }

		const user = await this.prismaService.user.update({
			where: { intraName: data["user"].intraName },
			data: { tfaEnabled: false }
		})
		this.logger.log(`tfa disabled for ${user.intraName}`)
		const jwtToken = JWT.sign(user, process.env.JWT_SECRET);
		await this.cacheManager.del(socket.handshake.auth.token)
		socket.handshake.auth = { token: jwtToken }
		return { token: jwtToken }
	}

	/**
	 * Sets the profile picture for a user.
	 * @param data Data.
	 * @param socket The websocket.
	 * @returns
	 */
	@SubscribeMessage("changeAvatar")
	public async changeAvatar(@MessageBody() data: object, @ConnectedSocket() socket: Socket) {
		this.logger.log(`User: ${data['id']} is trying to change avatar.`);

		if (!await this.prismaService.user.count({ where: { intraId: data["id"] }}))
			return { error: "User does not exist" };

		const avatarFile = `avatars/${data["id"]}`;
		const fileStream = fs.createWriteStream(`static/${avatarFile}`);
		await new Promise((resolve, reject) => {
			fileStream.on("finish", resolve);
			fileStream.on("error", reject);
			fileStream.write(Buffer.from(data["raw"]));
		}).catch((err) => {
			this.logger.log(`User: ${data['id']} failed to change avatar: ${err}`);
		}).then(() => {
			this.logger.log(`User: ${data['id']} changed avatar.`);
		});
		fileStream.close();
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

		if (!("redirectUrl" in data) || !("state" in data) || !("authCode" in data))
			return { error: "invalid request" }

		// Fetch the oauth token.

		const response = await fetch("https://api.intra.42.fr/oauth/token", {
			method: "POST",
			// @ts-ignore fuck you typescript
			body: new URLSearchParams({
				grant_type: "authorization_code",
				client_id: process.env.INTRA_KEY,
				client_secret: process.env.INTRA_SECRET,
				code: data["authCode"],
				state: data["state"],
				redirect_uri: data["redirectUrl"]
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

		return {
			token: jwtToken,
			state: data["state"],
			displayName: userData.name,
			intraName: userData.intraName,
			avatar: userData.avatar,
			hasTfa: userData.tfaEnabled
		}; // <===== jwt
	}
}

/*==========================================================================*/

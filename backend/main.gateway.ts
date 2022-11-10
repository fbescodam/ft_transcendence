import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, WsResponse } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { PrismaService } from "prisma/prisma.service";
import { Role } from "@prisma/client";
import { IntraGuard } from "auth/intra.guard";

//TODO: find elegant way to share objects between frontend and backend
//TODO: move this shit
export interface Message {
  text: string;
  inChannel: string;
  senderName: string;
}
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
})
export class MainGateway {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;
  @WebSocketServer()
  server;

  private readonly logger = new Logger("sockets");

  @UseGuards(IntraGuard)
  @SubscribeMessage('sendMsg')
  async handleMessage(@MessageBody() msg: Message): Promise<void> {
    this.server.emit('sendMsg', msg.text);
    // this.server.to(msg.inChannel).emit('sendMsg', msg.text);
    this.logger.log(`sent ${msg.text} to ${msg.inChannel} by ${msg.senderName}`);
    await this.prismaService.message.create({data: {
      senderName: msg.senderName,
      channelName: msg.inChannel,
      text: msg.text
    }});
  }

  @SubscribeMessage('getChannelsForUser')
  async getChannelsForUser(@MessageBody() userName: string): Promise<Object[]> {
    const user = await this.prismaService.user.findFirst({
      where: { name: userName },
      include: { channels: true }})
    this.logger.log(userName);
    return user.channels;
  }

  @SubscribeMessage('getMessagesFromChannel')
  async getMessagesFromChannel(@MessageBody() channelName: string): Promise<Object[]> {
    const channel = await this.prismaService.channel.findFirst({
      where: {name: channelName },
      include: { messages: true}
    })
    return channel.messages;
  }

  @SubscribeMessage('joinRooms')
  joinRooms(@MessageBody() roomInfo: string[], @ConnectedSocket() socket: Socket) {
    socket.join(roomInfo);
    this.logger.log(`joined ${roomInfo}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() roomInfo: {name: string}, @ConnectedSocket() socket: Socket) {
    socket.leave(roomInfo.name);
    this.logger.log(`left ${roomInfo.name}`);
  }

  @SubscribeMessage('createChannel')
  async createChannel(@MessageBody() channelData: Object): Promise<void> {

  }

  @SubscribeMessage('enterChannel')
  async enterChannel(@MessageBody() channelData: Object): Promise<void> {

  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(@MessageBody() channelData: Object): Promise<void> {

  }


  // @SubscribeMessage('createUser')
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

  @SubscribeMessage('sendFriendRequest')
  sendFriendRequest(@MessageBody() UserInfo: Object) {

  }

  @SubscribeMessage('unFriendUser')
  unFriendUser(@MessageBody() UserInfo: Object) {

  }

  @SubscribeMessage('authStart')
  async authStart(@MessageBody() code: string, @ConnectedSocket() socket: Socket): Promise<void> {
    socket.emit('authEnd', {token: "token"}); // TODO: implement Oauth2 here
  }
}




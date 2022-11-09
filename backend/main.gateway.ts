import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, WsResponse } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Inject, Logger } from '@nestjs/common';
import { PrismaService } from "prisma/prisma.service";

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
  async getMessagesFromChanel(@MessageBody() channelName: string): Promise<Object[]> {
    const channel = await this.prismaService.channel.findFirst({
      where: {name: channelName },
      include: { messages: true}
    })
    return channel.messages;
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() roomInfo: {name: string}, @ConnectedSocket() socket: Socket) {
    socket.join(roomInfo.name);
    this.logger.log(`joined ${roomInfo.name}`);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() roomInfo: {name: string}, @ConnectedSocket() socket: Socket) {
    socket.leave(roomInfo.name);
    this.logger.log(`left ${roomInfo.name}`);
  }

  @SubscribeMessage('createRoom')
  roomCreation(@MessageBody() roomInfo: {name: string}, @ConnectedSocket() socket: Socket): void {
    socket.join(roomInfo.name);
    this.server.to(roomInfo.name).emit('roomCreated', {roomInfo});
    this.logger.log(`created room: ${roomInfo.name}`);
  }


  @SubscribeMessage('blockUser')
  blockUser(@MessageBody() UserInfo: Object) {

  }

  @SubscribeMessage('unBlockUser')
  unBlockUser(@MessageBody() UserInfo: Object) {
    
  }

  @SubscribeMessage('sendFriendRequest')
  sendFriendRequest(@MessageBody() UserInfo: Object) {

  }

  @SubscribeMessage('unFriendUser')
  unFriendUser(@MessageBody() UserInfo: Object) {
    
  }

}




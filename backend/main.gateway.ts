import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket, WsResponse } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { PrismaService } from "prisma/prisma.service";
import { Role } from "@prisma/client";
import { IntraGuard } from "auth/intra.guard";
import fetch from "node-fetch";

export type idfk = any;

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
  // async createUser(@MessageBody() userData: idfk): Promise<void> {
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
  async authStart(@MessageBody() data: object, @ConnectedSocket() socket: Socket): Promise<idfk> {
    
    this.logger.log(data);


    const response = await fetch('https://api.intra.42.fr/oauth/token', {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.INTRA_KEY,
        client_secret: process.env.INTRA_SECRET,
        code: data['authCode'],
        state: data['state'], 
        redirect_uri: 'http://localhost:5173/auth'
      }),
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} });
    
    if (!response.ok) { this.logger.log(`shits fucked`); return {error: response.statusText} }
    const authResponse = await response.json()
    
    const responseUser = await fetch('https://api.intra.42.fr/v2/me', {
      method: 'GET',
      headers: {'Authorization': 'Bearer ' + authResponse['access_token'], 'Content-Type': 'application/json'}
    });
    this.logger.log(await responseUser.text());
    // const userResponse = await responseUser.json();



    return {token: "token", state: data['state']}; // <===== jwt


    //TODO: get token from intra
    //TODO: pull user data from intra
    //TODO: create user object in db
    //TODO: make jwt and return it

  }
}




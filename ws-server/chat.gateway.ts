import { IoAdapter } from "@nestjs/platform-socket.io";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

//TODO: find elegant way to share objects between frontend and backen
//TODO: move this shit
export interface Message {
  text: string,
  inChannel: string,
  sentAt: Date
}

export interface User {
  userName: string,
  friends: User[],
  //some other shit add when necessary 
  //some kinda object with all the game data

}
export interface RoomInfo {
  name: string,
  users: User[],
  //password? icon? idfk
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server;

  private readonly logger = new Logger("sockets");

  @SubscribeMessage('sendMsg')
  handleMessage(@MessageBody() msg: Message): void {
    console.log(`sent ${msg.text} to ${msg.inChannel}`);
    
    this.server.to(msg.inChannel).emit('sendMsg', msg.text);
    //TODO: shit msg into database
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
    socket.to(roomInfo.name).emit('roomCreated', {roomInfo});
    this.logger.log(`created room: ${roomInfo.name}`);
  }
}




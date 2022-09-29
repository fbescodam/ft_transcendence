import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { User } from 'user/user.entity';

//TODO: find elegant way to share objects between frontend and backend
//TODO: move this shit
export interface Message {
  text: string,
  inChannel: string,
  sentAt: Date
}

export interface UserInfo {
  id: string,
  userName: string,
  friends: User[],
  //some other shit add when necessary 
  //some kinda object with all the game data

}
export interface Room {
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
export class MainGateway {
  @WebSocketServer()
  server;

  private readonly logger = new Logger("sockets");

  @SubscribeMessage('sendMsg')
  handleMessage(@MessageBody() msg: Message): void {
    this.server.to(msg.inChannel).emit('sendMsg', msg.text);
    this.logger.log(`sent ${msg.text} to ${msg.inChannel}`);
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
    this.server.to(roomInfo.name).emit('roomCreated', {roomInfo});
    this.logger.log(`created room: ${roomInfo.name}`);
  }



  @SubscribeMessage('blockUser')
  blockUser(@MessageBody() UserInfo: User) {

  }

  @SubscribeMessage('unBlockUser')
  unBlockUser(@MessageBody() UserInfo: User) {
    
  }

  @SubscribeMessage('sendFriendRequest')
  sendFriendRequest(@MessageBody() UserInfo: User) {

  }

  @SubscribeMessage('unFriendUser')
  unFriendUser(@MessageBody() UserInfo: User) {
    
  }

}




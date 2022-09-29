import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

//TODO: find elegant way to share objects between frontend and backend
//TODO: move this shit
export interface Message {
  text: string,
  inChannel: string,
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




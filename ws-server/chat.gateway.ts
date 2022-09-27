import { IoAdapter } from "@nestjs/platform-socket.io";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

//TODO: find elegant way to share objects between frontend and backend
export interface Message {
  text: string;
  inChannel: string;
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

  @SubscribeMessage('chat message')
  handleMessage(@MessageBody() msg: Message): void {
    console.log(`sent ${msg.text} to ${msg.inChannel}`);
    this.server.in(msg.inChannel).emit('chat message', msg.text);
    //TODO: shit msg into database
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() room: {join: string, leave: string}, @ConnectedSocket() socket: Socket) {
    this.logger.log(`joined ${room.join}`)
    socket.join(room.join);
  }

  @SubscribeMessage('createRoom')
  roomCreation(@MessageBody() roomInfo: Object): void {
    
  }
}




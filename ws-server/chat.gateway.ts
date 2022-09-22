import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server;

  @SubscribeMessage('chat message')
  handleMessage(@MessageBody() msg: string): void {
    this.server.emit('chat message', msg);
    //TODO: shit msg into database
  }

  @SubscribeMessage('createroom')
  roomCreation(@MessageBody() roomInfo: Object): void {

  }
}




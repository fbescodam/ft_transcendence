import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor() { }

  private readonly logger = new Logger("authshit");


  async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken: string = client.handshake.auth.token;
      const jwtPayload: any = jwt.verify(authToken, process.env.JWT_SECRET)
      this.logger.log(jwtPayload)
      const user: any = this.validateUser(jwtPayload);


      context.switchToWs().getData().user = user;
      return Boolean(user);
    } catch (err) {
      this.logger.log(err.message)
      throw new WsException(err.message);
    }
  }

  validateUser(payload: any): any {
    return payload;
  }
}

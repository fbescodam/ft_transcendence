import { Socket } from 'socket.io';
import * as JWT from "jsonwebtoken"
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';


/*==========================================================================*/

@Injectable()
export class JwtGuard implements CanActivate {
	constructor() { }
	
	//= Properties =//

	private readonly logger = new Logger("authentication");

	//= Methods =//

	/**
	 * 
	 * @param context 
	 * @returns 
	 */
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		try {
			const client = context.switchToWs().getClient<Socket>();
			const jwtPayload = JWT.verify(client.handshake.auth.token, process.env.JWT_SECRET);
			
			const user = this.validateUser(jwtPayload);
			context.switchToWs().getData().user = user;
			
			return Boolean(user);
		} catch (err) {
			this.logger.log(err.message)
			throw new WsException(err.message);
		}
	}

	/**
	 * 
	 * @param payload 
	 * @returns 
	 */
	public validateUser(payload: string | JWT.JwtPayload) {
		return payload;
	}
}

/*==========================================================================*/

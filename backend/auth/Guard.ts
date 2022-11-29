import { Socket } from 'socket.io';
import * as JWT from "jsonwebtoken"
import { Inject, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';


/*==========================================================================*/

@Injectable()
export class JwtGuard implements CanActivate {
	
	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	
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
			const user = await this.validateUser(jwtPayload);

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
	public async validateUser(payload: Object | JWT.JwtPayload) {
		
		const user = await this.prismaService.user.findFirst({
			where: {
				intraName: payload["intraName"]
			}
		})

		return user
	}
}

/*==========================================================================*/

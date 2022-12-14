import { Socket } from 'socket.io';
import * as JWT from "jsonwebtoken"
import { Inject, Logger, CACHE_MANAGER } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Cache } from 'cache-manager'
import { Request } from 'express'


/*==========================================================================*/

@Injectable()
export class JwtGuard implements CanActivate {
	
	@Inject(PrismaService)
	private readonly prismaService: PrismaService;
	
	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
	
	//= Properties =//

	private readonly logger = new Logger("authentication");

	//= Methods =//

	/**
	 * 
	 * @param context 
	 * @returns 
	 */
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient<Socket>();
		try {

			//check if jwttoken has already been verified
			const cachedUserData: any = await this.cacheManager.get(client.handshake.auth.token)
			if (cachedUserData != null)
			{
				context.switchToWs().getData().user = JSON.parse(cachedUserData);
				return true
			}

			const jwtPayload = JWT.verify(client.handshake.auth.token, process.env.JWT_SECRET);
			const user = await this.validateUser(jwtPayload);
			if (user == null)
				throw new Error("you dont exist")

			context.switchToWs().getData().user = user;
			await this.cacheManager.set(client.handshake.auth.token, JSON.stringify(user), 1000); //1000s
			return Boolean(user);
		} catch (err) {
			this.logger.log(err.message)
			// client.disconnect()
			throw new WsException(err.message);
		}
	}

	/**
	 * 
	 * @param payload 
	 * @returns 
	 */
	public async validateUser(payload: any | JWT.JwtPayload) {
		
		try {
			const user = await this.prismaService.user.findFirst({
				where: {
					intraName: payload["intraName"]
				}
			})
			return user
		}
		catch(err){
			throw new Error("failed to acces the database")
		}

	}
}

/*==========================================================================*/

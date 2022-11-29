import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient
	implements OnModuleInit {
		
		async onModuleInit() {
			await this.$connect();
		}
		
		
		async enableShutdownHooks(app: INestApplication) {
			this.$on('beforeExit', async () => {
				await app.close();
			});
		}

		exclude<User, Key extends keyof User>(
			user: User,
			keys: Key[]
		  ): Omit<User, Key> {
			for (let key of keys) {
			  delete user[key]
			}
			return user
		}
}

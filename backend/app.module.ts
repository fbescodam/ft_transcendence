import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TwoFactorAuthenticationModule } from 'auth/2fa.module';
import { FriendsModule } from 'friends/friends.module';
import { GameModule } from 'game/game.module';

/*==========================================================================*/

@Module({
	imports: [
		PrismaModule,
		TwoFactorAuthenticationModule,
		FriendsModule,
		GameModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'static'),
			exclude: ['/avatar']
		}),
		CacheModule.register({
			isGlobal: true,
		})
	],
	controllers: [AppController],
	providers: [AppService, MainGateway],
})

/*==========================================================================*/

export class AppModule { }

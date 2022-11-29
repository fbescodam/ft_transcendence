import { JwtModule } from '@nestjs/jwt';
import { CacheModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TwoFactorAuthenticationModule } from 'auth/2fa.module';
import { GameGateway } from 'game/game.gateway';
import { GameService } from 'game/game.service';
import { FriendsModule } from 'friends/friends.module';

/*==========================================================================*/

@Module({
	imports: [
		PrismaModule,
		TwoFactorAuthenticationModule,
		FriendsModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'static')
		}),
		CacheModule.register({
			isGlobal: true,
		})
	],
	controllers: [AppController],
	providers: [AppService, GameService, MainGateway, GameGateway],
})

/*==========================================================================*/

export class AppModule { }

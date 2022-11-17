import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from 'prisma/prisma.module';

/*==========================================================================*/

@Module({
	imports: [
		PrismaModule,
		JwtModule.register({
			secret: process.env.INTRA_SECRET,
		})
	],
	controllers: [AppController],
	providers: [AppService, MainGateway],
})

/*==========================================================================*/

export class AppModule { }

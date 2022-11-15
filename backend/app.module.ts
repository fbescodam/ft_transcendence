import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

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
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';

import { GamesModule } from 'game/game.module';
import { ChannelsModule } from 'chat/channel/channel.module';
import { UsersModule } from 'user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './main.gateway';
import {join} from 'path';

@Module({
  imports: [ 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'socket-client'),
    }),
    UsersModule,
    GamesModule,
    ChannelsModule,
  ],
  // controllers: [AppController],
  providers: [AppService, MainGateway],
})
export class AppModule {}

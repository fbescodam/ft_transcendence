import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; //TODO: implement this for .env file
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';
import { Channel } from 'chat/channel/channel.entity';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [User, Game, Channel],
        synchronize: true, //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
      }),
    ],
  })
export class DatabaseModule {}
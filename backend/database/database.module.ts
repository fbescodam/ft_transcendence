import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; //TODO: implement this for .env file
import { User } from '../user/user.entity';
import { Game } from '../game/game.entity';
import { Channel } from 'chat/channel/channel.entity';
import { Message } from 'chat/messages/message.entity';
import { UserInChannel } from 'chat/channel/userInChannel.entity';

@Module({
    imports: [
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'user',
        password: 'password',
        database: 'test',
        entities: [
          User, 
          Game, 
          Channel, 
          Message, 
          UserInChannel],
        synchronize: true, //Setting synchronize: true shouldn't be used in production - otherwise you can lose production data.
      }),
    ],
  })
export class DatabaseModule {}


/*
psql -h localhost -p 5432 -U user -d test


list all tables
SELECT table_name FROM information_schema.tables;

*/

//https://stackoverflow.com/questions/37970743/postgresql-unique-violation-7-error-duplicate-key-value-violates-unique-const //TODO: this cause duplicate key error
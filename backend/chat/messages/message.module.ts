import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from './message.service';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagesService],
  controllers: [], //controller are for http requests but idfk when that would ever be used so its empty
  exports: [MessagesService]
})
export class MessagesModule {}
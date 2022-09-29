import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel.service';
import { Channel } from './channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],
  providers: [ChannelsService],
  controllers: [], //controller are for http requests but idfk when that would ever be used so its empty
})
export class ChannelsModule {}
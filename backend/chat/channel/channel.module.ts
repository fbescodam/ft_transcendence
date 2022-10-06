import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelsService } from './channel.service';
import { Channel } from './channel.entity';
import { UsersService } from 'user/user.service';
import { UsersModule } from 'user/user.module';
import { UserInChannel } from './userInChannel.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Channel, UserInChannel]), forwardRef(() => UsersModule)],
  providers: [ChannelsService],
  controllers: [], //controller are for http requests but idfk when that would ever be used so its empty
  exports: [ChannelsService]
})
export class ChannelsModule {}
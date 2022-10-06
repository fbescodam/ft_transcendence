import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { ChannelsModule } from 'chat/channel/channel.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ChannelsModule)],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [],
})
export class UsersModule {}
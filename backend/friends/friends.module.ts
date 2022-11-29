
import { Global, Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';

@Global()
@Module({
  providers: [FriendsGateway, FriendsService],
})
export class FriendsModule {}
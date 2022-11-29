
import { Global, Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';

@Global()
@Module({
  providers: [GameGateway, GameService],
  exports: [GameService, GameGateway],
})
export class GameModule {}

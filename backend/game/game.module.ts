import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesService } from './game.service';
import { Game } from './game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GamesService],
  controllers: [], //controller are for http requests but idfk when that would ever be used so its empty
  exports: [GamesService]
})
export class GamesModule {}
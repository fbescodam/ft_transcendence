import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';
import { createGameDto } from 'dto/all.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
  ) {}

  async getGameById(id: number): Promise<Game> {
    return this.gamesRepository.findOneBy({ gameId: id });
  }

  async remove(id: number): Promise<void> {
    await this.gamesRepository.delete(id);
  }

  async createGame(gameDto: createGameDto): Promise<Game> {
    const newGame = new Game();
    newGame.users = gameDto.users;
    newGame.startedAt = new Date();

    return this.gamesRepository.save(newGame);
  }

}


//TODO: fix up copy pasted shit
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private gamesRepository: Repository<Room>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.gamesRepository.find();
  }

  findOne(id: number): Promise<Room> {
    return this.gamesRepository.findOneBy({ roomId: id });
 }

  async remove(id: number): Promise<void> {
    await this.gamesRepository.delete(id);
  }
}

//TODO: fix up copy pasted shit
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private gamesRepository: Repository<Channel>,
  ) {}

  findAll(): Promise<Channel[]> {
    return this.gamesRepository.find();
  }

  findOne(id: number): Promise<Channel> {
    return this.gamesRepository.findOneBy({ roomId: id });
 }

  async remove(id: number): Promise<void> {
    await this.gamesRepository.delete(id);
  }
}

//TODO: fix up copy pasted shit
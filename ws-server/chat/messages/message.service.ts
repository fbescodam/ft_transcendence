import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private gamesRepository: Repository<Message>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.gamesRepository.find();
  }

  findOne(id: number): Promise<Message> {
    return this.gamesRepository.findOneBy({ messageId: id });
 }

  async remove(id: number): Promise<void> {
    await this.gamesRepository.delete(id);
  }
}

//TODO: fix up copy pasted shit
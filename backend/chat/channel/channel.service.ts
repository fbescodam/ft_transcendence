import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { addMessageToChannelDto, createChannelDto } from 'dto/all.dto';
import { UsersService } from 'user/user.service';
import { UserInChannel } from './userInChannel.entity';
import { Message } from 'chat/messages/message.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(UserInChannel)
		private readonly userInChannelRepository: Repository<UserInChannel>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
  ) {}

  async getChannelById(id: number): Promise<Channel> {
    return this.channelsRepository.findOneBy({ channelId: id });
  }

  async getChannelByName(searchName: string): Promise<Channel> {
    return this.channelsRepository.findOneBy({channelName: searchName})
  }

  async remove(id: number): Promise<void> {
    await this.channelsRepository.delete(id);
  }

  async createGlobalChannel(): Promise<Channel> {
    return this.createChannel({name:"global", admin:"admin"});
  }

  async createChannel(channelDto: createChannelDto): Promise<Channel> {
    const newChannel = new Channel();
    
    newChannel.channelName = channelDto.name;
    newChannel.admin = channelDto.admin;
    newChannel.messages = [];

    const adminUser = new UserInChannel();
    adminUser.userName = channelDto.admin;
    adminUser.joinDate = new Date();
    adminUser.userType = true; //true means admin (for now);
    adminUser.user = await this.userService.getuserByName(channelDto.admin);
    adminUser.channel = newChannel;

    newChannel.users = [adminUser];

    return this.channelsRepository.save(newChannel);
  }

  //return last 20 messages
  async getChannelMessages(channelName: string): Promise<Message[]> {
    return await (await this.getChannelByName(channelName)).messages.slice(0, 20);
  }

  async addMessageToChannel(message: addMessageToChannelDto): Promise<void> {
    const channel = await this.getChannelByName(message.channelName);
    const messageData = new Message();

    messageData.message = message.text;
    messageData.sentAt = new Date();
    messageData.sentBy = await this.userService.getuserByName(message.user);
    messageData.sentIn = channel;

    this.messageRepository.save(messageData);
  }

}

//TODO: fix up copy pasted shit
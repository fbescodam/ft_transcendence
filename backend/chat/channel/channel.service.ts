import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { createChannelDto } from 'dto/all.dto';
import { UsersService } from 'user/user.service';
import { UserInChannel } from './userInChannel.entity';

@Injectable()
export class ChannelsService {
  constructor(
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

    const adminUser = new UserInChannel();
    adminUser.userName = channelDto.admin;
    adminUser.joinDate = new Date();
    adminUser.userType = true; //true means admin (for now);
    adminUser.user = await this.userService.getuserByName(channelDto.admin);
    adminUser.channel = newChannel;

    newChannel.users = [adminUser];

    return this.channelsRepository.save(newChannel);
  }

}

//TODO: fix up copy pasted shit
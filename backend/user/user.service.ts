import { forwardRef, Injectable, Inject, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { createUserDto } from 'dto/all.dto';
import { ChannelsService } from 'chat/channel/channel.service';
import { UserInChannel } from 'chat/channel/userInChannel.entity';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => ChannelsService)) //forwardref for circular dependencies
    private readonly channelService: ChannelsService,
  ) {}

  private readonly logger = new Logger("UserService");

  onApplicationBootstrap() {
    this.createAdmin();
  }

  async getUserById(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async getuserByName(searchName: string): Promise<User> {
    return this.usersRepository.findOneBy({userName: searchName})
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  //global admin user
  async createAdmin(): Promise<User> {
    const newUser = new User();
    newUser.userName = "admin";
    newUser.joinDate = new Date();
    newUser.messages = [];
    newUser.friends = [];
    newUser.games = [];

    const globalChannel = await this.channelService.createChannel({
      name: "global", 
      admin: "admin"
    });
    newUser.channels = [globalChannel.users[0]];

    return this.usersRepository.save(newUser);
  }

  async createUser(userDto: createUserDto): Promise<User> {
    const newUser = new User();
    newUser.userName = userDto.userName;
    newUser.joinDate = new Date();
    
    const globalChannel = await this.channelService.getChannelByName("global")
    // newUser.channels = [globalChannel];

    return this.usersRepository.save(newUser);
  }

}

//TODO: fix up copy pasted shit
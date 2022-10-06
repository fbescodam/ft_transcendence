import { User } from 'user/user.entity'

export class createUserDto {
  userName: string; 
}

export class createGameDto {
  users: User[]
}

export class createChannelDto {
  name: string;
  admin: string; //uuid of user, for now i guess;
}
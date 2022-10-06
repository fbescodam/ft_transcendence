import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from 'user/user.entity';

@Entity()
export class UserInChannel {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userName: string;

    @Column()
    joinDate: Date;

    @Column({default: false})
    userType: boolean; //TODO: make this into an enum for differnt types, banned etc.

    @ManyToOne(() => User, (user) => user.id)
	user: User;

    @ManyToOne(() => Channel, (channel) => channel.channelId)
    channel: Channel
}

import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Message } from '../messages/message.entity';
import { UserInChannel } from './userInChannel.entity';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    channelId: number;

    @Column()
    channelName: string;

    @Column()
    admin: string; //TODO: username for now

    @OneToMany(() => UserInChannel, (user) => user.id, {cascade: true})
    @JoinColumn()
    users: UserInChannel[];

    @OneToMany(() => Message, (message) => message.messageId)
    messages: Message[];
}
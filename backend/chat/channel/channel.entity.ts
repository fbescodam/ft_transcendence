import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../user/user.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    roomId: number;

    @Column()
    roomName: string;

    @Column()
    admin: string; //TODO: should really be the User type but that gives a warning, now its the uuid string or whatever

    @ManyToMany(() => User)
    users: User[]

    @OneToMany(() => Message, (message) => message.messageId)
    messages: Message[];
}
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../user/user.entity';
import { Message } from '../messages/message.entity';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    roomId: number;

    @Column()
    roomName: string;

    @Column()
    admin: User;

    @ManyToMany(() => User)
    users: User[]

    @OneToMany(() => Message, (message) => message.messageId)
    messages: Message[];
}
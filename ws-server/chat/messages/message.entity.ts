import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Channel } from 'chat/channel/channel.entity';
import { User } from '../../user/user.entity';


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    messageId: number;

    @Column()
    message: string;

    @ManyToOne(() => User, (user) => user.id)
    sentBy: User;

    @ManyToOne(() => Channel, (room) => room.roomId)
    sentIn: Channel;

    @Column()
    sentAt: Date;
}
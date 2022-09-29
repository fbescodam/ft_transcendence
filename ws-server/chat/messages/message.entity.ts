import { Room } from 'chat/rooms/room.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    messageId: number;

    @Column()
    message: string;

    @Column()
    sentBy: User;

    @ManyToOne(() => Room, (room) => room.roomId)
    sentIn: Room;

    @Column()
    sentAt: Date;
}
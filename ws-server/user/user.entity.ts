import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Game } from '../game/game.entity';
import { Channel } from '../chat/channel/channel.entity';
import { Message } from 'chat/messages/message.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    userName: string;

    @Column()
    joinDate: Date;

    @OneToMany(() => Message, (message) => message.messageId)
    messages: Message[];

    @ManyToMany(() => User, { cascade: true})
    @JoinTable()
    friends: User[];

    @ManyToMany(() => Game)
    @JoinTable()
    games: Game[]

    @ManyToMany(() => Channel)
    @JoinTable()
    rooms: Channel[]

    // @Column()
    // image: Avatar; TODO: users avatar, guess this should be and object with the filepath and mime-type? deal with it later
}
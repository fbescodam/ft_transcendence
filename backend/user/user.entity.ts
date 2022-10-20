import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from '../game/game.entity';
import { Channel } from '../chat/channel/channel.entity';
import { Message } from 'chat/messages/message.entity';
import { UserInChannel } from 'chat/channel/userInChannel.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({unique: true})
    userName: string;

    @Column()
    joinDate: Date;

    @OneToMany(() => Message, (message) => message.messageId)
    messages: Message[]; //this is to remove a warning i didnt want to think about, but hey, now its a feature called 'message history'

    @ManyToMany(() => User, { cascade: true})
    @JoinTable()
    friends: User[];

    @ManyToMany(() => Game, (game) => game.gameId)
    @JoinTable()
    games: Game[]

    @OneToMany(() => UserInChannel, (user) => user.id, { cascade: true})
    @JoinColumn()
    channels: UserInChannel[];

    // @Column()
    // image: Avatar; TODO: users avatar, guess this should be and object with the filepath and mime-type? deal with it later
}
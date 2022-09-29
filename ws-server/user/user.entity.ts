import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Game } from '../game/game.entity';
import { Room } from '../chat/rooms/room.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    userName: string;

    @Column()
    joinDate: Date;

    @ManyToMany(() => User, { cascade: true})
    @JoinTable()
    friends: User[];

    @ManyToMany(() => Game)
    @JoinTable()
    games: Game[]

    @ManyToMany(() => Room)
    @JoinTable()
    rooms: Room[]

    // @Column()
    // image: Avatar; TODO: users avatar, guess this should be and object with the filepath and mime-type? deal with it later
}
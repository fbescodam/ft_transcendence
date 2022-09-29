import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Game } from '../game/game.entity';

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
}
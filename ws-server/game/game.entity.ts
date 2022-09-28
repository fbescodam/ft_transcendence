import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    gameId: number;

    @Column({default: [0, 0]})
    score: number[];

    @Column()
    startedAt: Date

    @Column({default: true})
    inProgress: boolean

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

    @Column()
    gameHistory: Object //some kinda data structure that allows a replay to be constructed from it, spatial columns?

}
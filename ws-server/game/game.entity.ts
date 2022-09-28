import { forkJoin } from 'rxjs';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    gameId: number;

    @Column({default: [0, 0]})
    score: number[];

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

}
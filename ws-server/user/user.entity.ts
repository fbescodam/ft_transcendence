import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Game } from '../game/game.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    userName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    joinDate: Date;

    @ManyToMany(() => Game)
    @JoinTable()
    games: Game[]
}
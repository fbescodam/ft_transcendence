export type Vec2 = { x: number; y: number };
export type Direction = number;
export type Dimensions = { w: number; h: number };
export type Player = {
	id: number;
	wins: number;
	loss: number;
	name: string;
	intraName: string;
	avatar: string;
    friends: Player[];
	games: Game[]
};
export type Game = {
    id: number;
    createDate: Date;
    players: Player[];
    victorScore: number;
    loserScore: number;
    winnerId: number;

    roomID: string;
};

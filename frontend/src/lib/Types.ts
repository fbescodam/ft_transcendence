export type Vec2 = { x: number; y: number };
export type Direction = number;
export type Dimensions = { w: number; h: number };
export type User = {
	id: number;
	name: string;
	intraName: string;
	avatar: string;
	games: Game[]
};
export type Game = {
	id: number;
	createDate: Date;
	players: User[];
	victorScore: number;
	loserScore: number;
	winnerId: number;

	roomID: string;
};

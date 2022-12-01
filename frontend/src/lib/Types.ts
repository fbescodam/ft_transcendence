// if you change User, please also update createPlaceholderUser in Placeholders.ts
export type User = {
	id: number;
	wins: number;
	loss: number;
	name: string;
	intraName: string;
	avatar: string;
	games: Game[];
	friends: User[];
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

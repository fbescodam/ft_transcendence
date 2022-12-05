// if you change User, please also update createPlaceholderUser in Placeholders.ts
// no i wont lol fuck you
export type User = {
	id: number;
	wins: number;
	losses: number;
	name: string;
	intraName: string;
	avatar: string;
	games: Game[];
	friends: User[];
	blocked: User[];
	blockedWho: String[];
	online: boolean;
};

export type Game = {
	id: number;
	createDate: Date;
	players: User[];
	victorScore: number;
	loserScore: number;
	winnerId: number;

	roomID: string;
	status : "WAITING" | "ONGOING" | "ENDED"
};


export interface Profile {
    intraID: number;
    username: string;
    imgURL: string;
    color: string;
	
    rank: number;

    wins: number;
    losses: number;

    friends: Profile[];
    blocked: Profile[];
}
import { Vector } from "vecti";

export type ReactDispatch<T> = React.Dispatch<React.SetStateAction<T>>

// Single user profile
export interface Profile {
    intraID: number;
    username: string;
    imgURL: string;
	
    rank: number;

    wins: number;
    losses: number;

    friends: Profile[];
    blocked: Profile[];
}

// Message which was sent by a profile.
export interface Message {
    id: number;
    text: string;
    sender: Profile;
}

// Group chat with messages
export interface ChatChannel {
    id: number;

    name: string;
    messages: Message[];
    users: Profile[];
}

import type { PausedReasonObject, Dimensions, Direction, Vec2 } from "./StateMachine";

export interface OnlinePaddleState {
	position: string;
	pos: Vec2;
	size: Dimensions;
	dy: Direction;
}

export interface OnlinePlayerState {
	avatar: string;
	name: string;
	paddle: OnlinePaddleState;
	score: number;
	ready: boolean;
}

export interface OnlineGameState {
	time: {
		timestamp: number;
		secondsPlayed: number;
		gameDuration: number;
	}

	paused: PausedReasonObject | null;

	players: {
		left: OnlinePlayerState,
		right: OnlinePlayerState
	};

	ball: {
		pos: Vec2;
		size: Dimensions;
		dy: Direction;
		dx: Direction;
		speed: number;
	};
}

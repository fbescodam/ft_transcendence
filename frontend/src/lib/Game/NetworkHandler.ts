import type { Dimensions, Direction, Vec2 } from "$lib/Types";
import type { Socket } from "socket.io-client";
import type { PausedReasonObject } from "./StateMachine";

export interface OnlinePlayerState {
	avatar: string;
	name: string;
	paddle: {
		position: string;
		pos: Vec2;
		size: Dimensions;
		dy: Direction;
	}
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

class GameNetworkHandler {
	private _io: Socket;
	private _gameId: number;
	private _stateHandler: (state: OnlineGameState) => void;

	constructor(gameId: number, io: Socket, stateHandler: (state: OnlineGameState) => void) {
		this._gameId = gameId;
		this._io = io;
		this._stateHandler = stateHandler;

		this._io.on("serverGameState", (state: OnlineGameState) => {
			this._stateHandler(state);
		});
	}

	public sendState(state: OnlineGameState) {
		this._io.emit("clientGameState", { game: { id: this._gameId, state: state}}, (ret: any) => {
			if ("error" in ret) {
				console.error(ret.error);
			}
			else if (ret.status !== true) {
				console.warn("Failed to send game state to server");
			}
		});
	}
}

export default GameNetworkHandler;

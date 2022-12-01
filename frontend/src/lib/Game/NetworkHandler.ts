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
	sourceSocketId: string,

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
			if (state.sourceSocketId == this._io.id)
				return;
			console.log("Received game state from server", state);
			this._stateHandler(state);
		});

		this._io.emit("setupGameConnection", {}, (ret: any) => {
			if (ret.connectedToGame !== true) {
				console.warn("Failed to connect to game: user is probably not in any game", ret);
			}
		});
	}

	public sendState = (state: OnlineGameState) => {
		console.log("Sending game state to server", state);
		this._io.emit("clientGameState", { game: { id: this._gameId, state: state}}, (ret: any) => {
			if ("error" in ret) {
				console.error(ret.error);
			}
			else if (ret.status !== true) {
				console.warn("Failed to send game state to server");
			}
		});
	}

	public getSocketId = (): string => {
		return this._io.id;
	}
}

export default GameNetworkHandler;

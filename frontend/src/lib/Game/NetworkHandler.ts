import type { Dimensions, Direction, Vec2 } from "$lib/Types";
import type { Socket } from "socket.io-client";
import { PausedReason, type PausedReasonObject } from "./StateMachine";

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
			console.log("Received game state from server:", state);
			const invertedState = this._invertGameState(state);
			console.log("Inverted game state:", invertedState)
			this._stateHandler(invertedState);
		});

		this._io.emit("setupGameConnection", {}, (ret: any) => {
			if (ret.connectedToGame !== true) {
				console.warn("Failed to connect to game: user is probably not in any game", ret);
			}
		});
	}

	private _invertGameState = (gameState: OnlineGameState): OnlineGameState => {
		const tempLeft: OnlinePlayerState = gameState.players.left;
		gameState.players.left = gameState.players.right;
		gameState.players.right = tempLeft;
		if (gameState.paused == PausedReason.PAUSED_BY_PLAYER)
			gameState.paused = PausedReason.PAUSED_BY_OPPONENT;
		else if (gameState.paused == PausedReason.PAUSED_BY_OPPONENT)
			gameState.paused = PausedReason.PAUSED_BY_PLAYER;
		else if (gameState.paused == PausedReason.GAME_WON)
			gameState.paused = PausedReason.GAME_OVER;
		else if (gameState.paused == PausedReason.GAME_OVER)
			gameState.paused = PausedReason.GAME_WON;
		return gameState;
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

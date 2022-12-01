import { PausedReason, type PausedReasonObject, type Dimensions, type Direction, type Vec2 } from "./StateMachine";
import type { Socket } from "socket.io";

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

class GameNetworkHandler {
	private _io: Socket;
	private _gameId: number;
	private _clientStateHandler: null | ((state: OnlineGameState) => void);
	private _hostStateHandler: null | ((state: OnlinePaddleState) => void);
	private _isHost: boolean;

	constructor(gameId: number, io: Socket, clientStateHandler: null | ((state: OnlineGameState) => void) = null, hostStateHandler: null | ((state: OnlinePaddleState) => void) = null) {
		if (clientStateHandler && hostStateHandler)
			throw new Error("Only one of clientStateHandler and hostStateHandler can be set");

		this._gameId = gameId;
		this._io = io;
		this._clientStateHandler = clientStateHandler;
		this._hostStateHandler = hostStateHandler;
		this._isHost = (this._hostStateHandler !== null);

		if (!this._isHost) {
			this._io.on("gameState", (state: OnlineGameState) => {
				// console.log("Received game state from host:", state);
				// const invertedState = this._invertGameState(state);
				// console.log("Inverted game state:", invertedState)
				// this._clientStateHandler!(invertedState);
				this._clientStateHandler!(state);
			});

			this._io.emit("setupGameConnection", {}, (ret: any) => {
				if (ret.connectedToGame !== true) {
					console.warn("Failed to connect to game: user is probably not in any game", ret);
				}
			});
		}
		else {
			this._io.on("gameState", (state: OnlinePaddleState) => {
				console.log("Received game state from client:", state);
				this._hostStateHandler!(state);
			});
		}
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
		console.log("Sending game state", state);
		this._io.emit("gameState", { game: { id: this._gameId, state: state}}, (ret: any) => {
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

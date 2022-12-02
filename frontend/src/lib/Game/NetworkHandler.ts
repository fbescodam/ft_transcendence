import type GameStateMachine from "./StateMachine";
import type { OnlineGameState, OnlinePaddleState, OnlinePlayerState } from "./NetworkTypes";
import type { Socket } from "socket.io-client";
// server: change above to socket.io. client: change above to socket.io-client

class GameNetworkHandler {
	private _io: Socket;
	private _gameState: GameStateMachine;
	private _stateHandler: (state: OnlineGameState) => void;
	private _lastResponseTime: number = Infinity;

	constructor(gameState: GameStateMachine, io: Socket, stateHandler: (state: OnlineGameState) => void) {
		this._gameState = gameState;
		this._io = io;
		this._stateHandler = stateHandler;

		console.log("Registering client state handler");
		this._io.on("gameState", (state: OnlineGameState) => {
			this._lastResponseTime = Date.now() - state.time.timestamp;
			this._stateHandler(state);
		});

		this._io.emit("setupGameConnection", {}, (ret: any) => {
			if (ret.connectedToGame !== true) {
				console.warn("Failed to connect to game: user is probably not in any game", ret);
			}
		});
	}

	public sendPaddleState = (paddleState: OnlinePaddleState) => {
		this._io.emit("paddleGameState", { game: { id: this._gameState.getGameId(), paddleState: paddleState}}, (ret: any) => {
			if ("error" in ret) {
				console.error(ret.error);
			}
		});
	}

	/**
	 * Mark a player as ready in an online multiplayer game
	 * @param playerReady The intraName of the player that is ready
	 */
	public sendPlayerReady = (playerReady: string) => {
		console.log("Sending player ready");
		this._io.emit("playerReady", { game: { id: this._gameState.getGameId(), playerReady: playerReady }}, (ret: any) => {
			if ("error" in ret)
				console.error(ret.error);
			else {
				console.log("Player ready sent", ret);
				this._gameState.handleOnlineState(ret);
			}
		});
	}

	public getSocketId = (): string => {
		return this._io.id;
	}

	public getResponseTime = (): number => {
		return this._lastResponseTime;
	}
}

export default GameNetworkHandler;

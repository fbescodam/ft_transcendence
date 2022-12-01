import { PausedReason } from "./StateMachine";
import type { OnlineGameState, OnlinePaddleState, OnlinePlayerState } from "./NetworkTypes";
import type { Socket } from "socket.io-client";
// server: change above to socket.io. client: change above to socket.io-client

class GameNetworkHandler {
	private _io: Socket;
	private _gameId: number;
	private _stateHandler: (state: OnlineGameState) => void;

	constructor(gameId: number, io: Socket, stateHandler: (state: OnlineGameState) => void) {
		this._gameId = gameId;
		this._io = io;
		this._stateHandler = stateHandler;

		console.log("Registering client state handler");
		this._io.on("gameState", (state: OnlineGameState) => {
			this._stateHandler(state);
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

	public sendPaddleState = (paddleState: OnlinePaddleState) => {
		console.log("Sending paddle state", paddleState);
		this._io.emit("paddleGameState", { game: { id: this._gameId, state: paddleState}}, (ret: any) => {
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
		this._io.emit("playerReady", { game: { id: this._gameId, playerReady: playerReady }}, (ret: any) => {
			if ("error" in ret) {
				console.error(ret.error);
			}
		});
	}

	public getSocketId = (): string => {
		return this._io.id;
	}
}

export default GameNetworkHandler;

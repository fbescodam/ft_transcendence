import type { Direction } from "../Types";
import type GameTicker from "./Ticker";
import type GameStateMachine from "./StateMachine";
import { LOCAL_MULTIPL_MODE_ID } from "./Modes";
import { PausedReason } from "./StateMachine";

class GameController {
	private _gameState: GameStateMachine;
	private _keysPressed: { [key: string]: boolean } = {};

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, tickRate: number = 60) {
		this._gameState = gameState;

		// run controller update every tick
		gameTicker.add(this._update);
	}

	private _movePaddleP1 = () => {
		const maxSpeed = this._gameState.player1.paddle.getMaxMoveSpeed();
		let dy: Direction = 0;
		if (this._keysPressed["w"] && !this._keysPressed["s"])
			dy = -maxSpeed;
		if (this._keysPressed["s"] && !this._keysPressed["w"])
			dy = maxSpeed;
		this._gameState.player1.paddle.setMoveDirection(dy);
	}

	private _movePaddleP2 = () => {
		const maxSpeed = this._gameState.player2.paddle.getMaxMoveSpeed();
		let dy: Direction = 0;
		if (this._keysPressed["ArrowUp"] && !this._keysPressed["ArrowDown"])
			dy = -maxSpeed;
		if (this._keysPressed["ArrowDown"] && !this._keysPressed["ArrowUp"])
			dy = maxSpeed;
		this._gameState.player2.paddle.setMoveDirection(dy);
	}

	public _update = () => {
		if (this._gameState.isPausedBool())
			return;

		// In all game modes
		this._movePaddleP1();

		// Only in local multiplayer mode
		if (this._gameState.getGameMode() == LOCAL_MULTIPL_MODE_ID)
			this._movePaddleP2();
	};

	//= Public =//
	public setKeyPressed = (key: string) => {
		this._keysPressed[key] = true;
	};

	public setKeyNotPressed = (key: string) => {
		if (key in this._keysPressed)
			delete this._keysPressed[key];
	};

	public pause = () => {
		this._gameState.pauseGame(PausedReason.PAUSED_BY_PLAYER);
	}

	public resume = () => {
		this._gameState.unPauseGame();
	}

	public togglePause = () => {
		if (this._gameState.isPaused())
			this.resume();
		else
			this.pause();
	}
}

export default GameController;

import type { SimpleDirection } from "./GameState";
import type GameStateMachine from "./GameState";
import { LOCAL_MULTIPL_MODE_ID } from "./Modes";

class GameController {
	private _gameState: GameStateMachine;
	private _keysPressed: { [key: string]: boolean } = {};
	private _tickRate: number;

	constructor(gameState: GameStateMachine, tickRate: number = 60) {
		this._gameState = gameState;
		this._tickRate = tickRate;

		// start "controller" loop
		setInterval(() => this._update(), 1000 / this._tickRate);
	}

	private _movePaddleP1 = () => {
		let dy: SimpleDirection = 0;
		if (this._keysPressed["ArrowUp"] && !this._keysPressed["ArrowDown"])
			dy = -1;
		if (this._keysPressed["ArrowDown"] && !this._keysPressed["ArrowUp"])
			dy = 1;
		this._gameState.player1.paddle.dy = dy;
	}

	private _movePaddleP2 = () => {
		let dy: SimpleDirection = 0;
		if (this._keysPressed["w"] && !this._keysPressed["s"])
			dy = -1;
		if (this._keysPressed["s"] && !this._keysPressed["w"])
			dy = 1;
		this._gameState.player2.paddle.dy = dy;
	}

	private _update = () => {
		if (this._gameState.paused)
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
		this._gameState.paused = true;
	}

	public resume = () => {
		this._gameState.paused = false;
	}

	public togglePause = () => {
		this._gameState.paused = !this._gameState.paused;
	}
}

export default GameController;

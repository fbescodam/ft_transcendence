import type GameTicker from "./Ticker";
import type GameStateMachine from "./StateMachine";
import type { Direction } from "./StateMachine";
import { PausedReason } from "./StateMachine";
import { LOCAL_MULTIPL_MODE_ID } from "./Modes";

class GameController {
	private _gameState: GameStateMachine;
	private _keysPressed: { [key: string]: boolean } = {};
	private _mainUser: string;

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, mainUserIntraName: string) {
		this._gameState = gameState;
		this._mainUser = mainUserIntraName;

		// run controller update every tick
		gameTicker.add('controller', this._update);

		// mark main user as ready
		this._getMainUser().markReady();
	}

	private _getMainUser() {
		if (this._gameState.player1.intraName === this._mainUser)
			return this._gameState.player1;
		return this._gameState.player2;
	}

	private _getOtherUser() {
		if (this._gameState.player1.intraName === this._mainUser)
			return this._gameState.player2;
		return this._gameState.player1;
	}

	/**
	 * Move the paddle of player 1
	 */
	private _movePaddleWS = () => {
		const player = this._getMainUser();
		const maxSpeed = player.paddle.getMaxMoveSpeed();
		let dy: Direction = 0;
		if (this._keysPressed["w"] && !this._keysPressed["s"])
			dy = -maxSpeed;
		if (this._keysPressed["s"] && !this._keysPressed["w"])
			dy = maxSpeed;
		player.paddle.setMoveDirection(dy);
	}

	/**
	 * Move the paddle of player 2 - this is only used in local multiplayer mode
	 */
	private _movePaddleArrows = () => {
		const player = this._getOtherUser();
		const maxSpeed = player.paddle.getMaxMoveSpeed();
		let dy: Direction = 0;
		if (this._keysPressed["ArrowUp"] && !this._keysPressed["ArrowDown"])
			dy = -maxSpeed;
		if (this._keysPressed["ArrowDown"] && !this._keysPressed["ArrowUp"])
			dy = maxSpeed;
		player.paddle.setMoveDirection(dy);
	}

	/**
	 * Ticker function - this function is run every game tick.
	 * @param tps: The current ticks per second
	 * @param deltaTick The time since the last tick in milliseconds.
	 */
	public _update = (tps: number, deltaTick: number) => {
		if (this._gameState.isPaused())
			return;

		// In all game modes
		this._movePaddleWS();

		// Only in local multiplayer mode
		if (this._gameState.getGameMode() == LOCAL_MULTIPL_MODE_ID)
			this._movePaddleArrows();
	};

	//= Public =//

	/**
	 * Run this function when a key is pressed using the onkeydown event.
	 * @param key The key that was pressed (event.key)
	 */
	public setKeyPressed = (key: string) => {
		this._keysPressed[key] = true;
	};

	/**
	 * Run this function when a key is no longer being pressed using the onkeyup event.
	 * @param key The key that was released (event.key)
	 */
	public setKeyNotPressed = (key: string) => {
		if (key in this._keysPressed)
			delete this._keysPressed[key];
	};

	/**
	 * Pause the game from the current player's perspective.
	*/
	public pause = () => {
		if (!this._gameState.isPaused())
			this._gameState.pauseGame(PausedReason.PAUSED_P1);
	}

	/**
	 * Resume the game from the current player's perspective.
	 */
	public resume = () => {
		if (this._gameState.getPausedReason() == PausedReason.PAUSED_P1)
			this._gameState.unPauseGame();
	}

	/**
	 * Toggle the paused state of the game from the current player's perspective.
	 */
	public togglePause = () => {
		if (this._gameState.isPaused())
			this.resume();
		else
			this.pause();
	}
}

export default GameController;

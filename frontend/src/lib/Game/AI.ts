import type GameTicker from "./Ticker";
import type { Paddle } from "./StateMachine";
import type GameStateMachine from "./StateMachine";
import type { SimpleDirection } from "$lib/Types";

class GameAI {
	private _gameState: GameStateMachine;
	private _randomDirection: SimpleDirection = 0;
	private _lastRandomDirectionChange: number = new Date().getTime();
	private _paddle: Paddle;

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, paddle: Paddle, tickRate: number = 60) {
		this._gameState = gameState;
		this._paddle = paddle;

		// run controller update every tick
		gameTicker.add(this._think);
	}

	// AI is always player 2
	private _think = () => {
		if (this._gameState.paused)
			return;

		// Calculate where the ball will likely go
		const possibleY = this._gameState.ball.intersectsAtY(this._paddle.pos.x);
		console.log(possibleY);

		// Move paddle to intercept the ball
		if (possibleY != Infinity) {
			const paddleOffset = this._paddle.size.h * 0.3;

			// Paddle is in the right position
			if (possibleY > this._paddle.pos.y + paddleOffset &&
					possibleY < this._paddle.pos.y + this._paddle.size.h - paddleOffset)
				this._paddle.dy = 0;

			// Paddle is too high
			else if (possibleY > this._paddle.pos.y + paddleOffset)
				this._paddle.dy = 1;

			// Paddle is too low
			else if (possibleY < this._paddle.pos.y + this._paddle.size.h - paddleOffset)
				this._paddle.dy = -1;
		}
		else {
			const rethinkAfter = 320;
			const now = new Date().getTime();
			if (now - this._lastRandomDirectionChange > rethinkAfter) {
				this._lastRandomDirectionChange = now;
				this._randomDirection = (this._paddle.pos.y + this._paddle.size.h / 2) > this._gameState.ball.pos.y ? -1 : 1;
			}
			this._paddle.dy = this._randomDirection;
		}
	};
}

export default GameAI;

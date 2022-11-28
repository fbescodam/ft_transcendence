import type GameTicker from "./Ticker";
import type { Paddle } from "./StateMachine";
import type GameStateMachine from "./StateMachine";
import type  from "./StateMachine";
import type { Direction } from "$lib/Types";
import { getRandomArbitrary } from "$lib/Utils/Basic";

class GameAI {
	private _gameState: GameStateMachine;
	private _rethinkAfter = 320;
	private _randomDirection: Direction = 0;
	private _lastRandomDirectionChange: number = new Date().getTime();
	private _paddle: Paddle;

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, paddle: Paddle, tickRate: number = 60) {
		this._gameState = gameState;
		this._paddle = paddle;

		// run controller update every tick
		gameTicker.add(this._think);
	}

	private _randomBehaviour = (followBall: boolean = true) => {
		const now = new Date().getTime();
		if (now - this._lastRandomDirectionChange > this._rethinkAfter) {
			this._lastRandomDirectionChange = now;
			const rand = getRandomArbitrary(1, this._paddle.getMaxMoveSpeed() * 0.5);
			if (followBall)
				this._randomDirection = (this._paddle.pos.y + this._paddle.size.h / 2) > this._gameState.ball.pos.y ? -rand : rand;
			else
				this._randomDirection = (Math.random() > 0.5 ? -rand : rand);
		}
		console.log(this._randomDirection);
		this._paddle.setMoveDirection(this._randomDirection);
	}

	// AI is always player 2
	private _think = () => {
		if (this._gameState.paused)
			return;

		// Calculate where the ball will likely go
		const possibleY = this._gameState.ball.intersectsAtY(this._paddle.pos.x);

		// Move paddle to intercept the ball
		if (possibleY != Infinity) {
			const paddleOffset = this._paddle.size.h * 0.3;

			// Paddle is in the right position, keep it still
			if (possibleY > this._paddle.pos.y + paddleOffset &&
					possibleY < this._paddle.pos.y + this._paddle.size.h - paddleOffset)
				this._randomBehaviour(false);

			// Move the paddle towards the ball
			else
				this._paddle.setMoveDirection(possibleY - this._paddle.pos.y - paddleOffset);
		}
		else {
			this._randomBehaviour();
		}
	};
}

export default GameAI;

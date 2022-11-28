import type GameTicker from "./Ticker";
import type { Paddle } from "./StateMachine";
import type GameStateMachine from "./StateMachine";
import type  from "./StateMachine";
import type { Direction } from "$lib/Types";
import { getRandomArbitrary } from "$lib/Utils/Basic";

class GameAI {
	// AI knowledge
	private _gameState: GameStateMachine;
	private _paddle: Paddle;

	// AI brains
	private _followBall: boolean = true;
	private _rethinkAfter = 320;
	private _randomDirection: Direction = 0;
	private _lastRandomDirectionChange: number = new Date().getTime();

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, paddle: Paddle, tickRate: number = 60) {
		this._gameState = gameState;
		this._paddle = paddle;
		this._paddle.limitMoveSpeed();

		// run controller update every tick
		gameTicker.add(this._think);
	}

	/**
	 * Check if it's time to make another decision of where to move the paddle to, and if so, make a decision.
	 * @param followBallOverride If set, this will override the current followBall setting
	 */
	private _rethinkIfItsTime = (followBallOverride: boolean = false) => {
		const now = new Date().getTime();
		if (now - this._lastRandomDirectionChange > this._rethinkAfter) {
			this._lastRandomDirectionChange = now;
			this._followBall = Math.random() > 0.5; // 50% chance that the AI decides to follow the ball around
			const rand = getRandomArbitrary(1, this._paddle.getMaxMoveSpeed() * 0.5); // Decide on a random speed to move the paddle at

			// If the AI is supposed to follow the ball, move the paddle in the same direction as the ball
			if (followBallOverride || this._followBall)
				this._randomDirection = (this._paddle.pos.y + this._paddle.size.h / 2) > this._gameState.ball.pos.y ? -rand : rand;

			// Else, move the paddle in a random direction with the random speed calculated earlier
			else
				this._randomDirection = (Math.random() > 0.5 ? -rand : rand);
		}
	}

	/**
	 * This function is ran when the AI does not know where the ball will go currently, or is quite sure it's gonna intercept it.
	 * @param followBallOverride If set, this will override the current followBall setting
	 */
	private _randomBehaviour = (followBallOverride: boolean = false) => {
		this._rethinkIfItsTime(followBallOverride);
		this._paddle.setMoveDirection(this._randomDirection);
	}

	/**
	 * Ticker function - this function is run every game tick.
	 */
	private _think = () => {
		if (this._gameState.isPausedBool())
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

			// Move the paddle towards the ball (randomDirection should not be here but we add some randomness to it)
			else {
				this._paddle.setMoveDirection(possibleY + this._randomDirection * 2 - this._paddle.pos.y - paddleOffset + this._randomDirection);
			}
		}
		else {
			this._randomBehaviour(false);
		}
	};
}

export default GameAI;

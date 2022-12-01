import type GameTicker from "./Ticker";
import type { Player, Paddle, Direction } from "./StateMachine";
import type GameStateMachine from "./StateMachine";
import { getRandomArbitrary } from "$lib/Utils/Basic";

class GameAI {
	// AI knowledge
	private _gameState: GameStateMachine;
	private _player: Player;

	// AI brains
	private _followBall: boolean = true;
	private _rethinkEvery = 320; // ms
	private _randomDirection: Direction = 0;
	private _lastRandomDirectionChange: number = Date.now();

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, player: Player, tickRate: number = 60) {
		this._gameState = gameState;
		this._player = player;
		this._player.paddle.limitMoveSpeed();

		// run controller update every tick
		gameTicker.add('ai', this._think);

		// mark AI player as ready
		this._player.markReady();
	}

	/**
	 * Check if it's time to make another decision of where to move the paddle to, and if so, make a decision.
	 * @param followBallOverride If set, this will override the current followBall setting
	 */
	private _rethinkIfItsTime = (followBallOverride: boolean = false) => {
		const now = Date.now();
		if (now - this._lastRandomDirectionChange > this._rethinkEvery) {
			this._lastRandomDirectionChange = now;
			this._followBall = Math.random() > 0.5; // 50% chance that the AI decides to follow the ball around
			const rand = getRandomArbitrary(1, this._player.paddle.getMaxMoveSpeed() * 0.5); // Decide on a random speed to move the paddle at

			// If the AI is supposed to follow the ball, move the paddle in the same direction as the ball
			if (followBallOverride || this._followBall)
				this._randomDirection = (this._player.paddle.pos.y + this._player.paddle.size.h / 2) > this._gameState.ball.pos.y ? -rand : rand;

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
		this._player.paddle.setMoveDirection(this._randomDirection);
	}

	/**
	 * Ticker function - this function is run every game tick.
	 * @param tps: The current ticks per second
	 * @param deltaTick The time since the last tick in milliseconds.
	 */
	private _think = (tps: number, deltaTick: number) => {
		if (this._gameState.isPaused())
			return;

		// Calculate where the ball will likely go
		const possibleY = this._gameState.ball.intersectsAtY(this._player.paddle.pos.x);

		// Move paddle to intercept the ball
		if (possibleY != Infinity) {
			const paddleOffset = this._player.paddle.size.h * 0.3;

			// Paddle is in the right position, keep it still
			if (possibleY > this._player.paddle.pos.y + paddleOffset &&
					possibleY < this._player.paddle.pos.y + this._player.paddle.size.h - paddleOffset)
				this._randomBehaviour(false);

			// Move the paddle towards the ball (randomDirection should not be here but we add some randomness to it)
			else {
				this._player.paddle.setMoveDirection(possibleY + this._randomDirection * 2 - this._player.paddle.pos.y - paddleOffset + this._randomDirection);
			}
		}
		else {
			this._randomBehaviour(false);
		}
	};

	//= Public =//
	public getState = () => {
		return {
			paddle: this._player.paddle.getPosition(),
			followBall: this._followBall,
			randomDirection: this._randomDirection,
			lastRandomDirectionChange: this._lastRandomDirectionChange,
			rethinkEvery: this._rethinkEvery,
		}
	}

}

export default GameAI;

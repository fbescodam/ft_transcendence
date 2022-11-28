import type GameTicker from "./Ticker";
import type GameStateMachine from "./StateMachine";

class GameAI {
	private _gameState: GameStateMachine;

	constructor(gameTicker: GameTicker, gameState: GameStateMachine, tickRate: number = 60) {
		this._gameState = gameState;

		// run controller update every tick
		gameTicker.add(this._think);
	}

	// AI is always player 2
	private _think = () => {
		if (this._gameState.paused)
			return;

		// Calculate where the ball will likely go
		const possibleY = this._gameState.ball.intersectsAtY(this._gameState.player2.paddle.pos.x);
		console.log(possibleY);

		// Move paddle to intercept the ball
		if (possibleY != Infinity) {
			const paddleOffset = this._gameState.player2.paddle.size.h * 0.3;
			if (possibleY > this._gameState.player2.paddle.pos.y + paddleOffset && possibleY < this._gameState.player2.paddle.pos.y + this._gameState.player2.paddle.size.h - paddleOffset)
				this._gameState.player2.paddle.dy = 0;
			else if (possibleY > this._gameState.player2.paddle.pos.y + paddleOffset)
				this._gameState.player2.paddle.dy = 1;
			else if (possibleY < this._gameState.player2.paddle.pos.y + this._gameState.player2.paddle.size.h - paddleOffset)
				this._gameState.player2.paddle.dy = -1;
		}
	};
}

export default GameAI;

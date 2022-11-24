import type GameStateMachine from "./GameState";

class GameRenderer {
	private _gameState: GameStateMachine;
	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement, gameState: GameStateMachine) {
		this._gameState = gameState;
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d")!;

		requestAnimationFrame(this._renderFrame);
	}

	private _renderFrame = () => {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

		// render game objects
		this._gameState.ball.render(this._ctx);
		this._gameState.player1.paddle.render(this._ctx);
		this._gameState.player2.paddle.render(this._ctx);

		// middle line
		const grid = 7;
		for (let i = grid; i < this._canvas.height - grid; i += grid * 2) {
			this._ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			this._ctx.fillRect(this._canvas.width * 0.5 - grid * 0.5, i, grid, grid);
		}

		// paused text
		if (this._gameState.paused) {
			this._ctx.fillStyle = "#fff";
			this._ctx.font = "48px 'Common Pixel'";
			this._ctx.textAlign = "center";
			this._ctx.fillText("GAME PAUSED", this._canvas.width * 0.5, this._canvas.height * 0.5);
		}

		requestAnimationFrame(this._renderFrame);
	};
};

export default GameRenderer;

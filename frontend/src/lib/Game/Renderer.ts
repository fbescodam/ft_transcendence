import { PausedReason, type ScoreUpdatedEvent } from "./StateMachine";
import type GameStateMachine from "./StateMachine";

class GameRenderer {
	private _gameState: GameStateMachine;
	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private _scores: HTMLElement;

	constructor(canvas: HTMLCanvasElement, gameState: GameStateMachine, scores: HTMLElement) {
		this._gameState = gameState;
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d")!;
		this._scores = scores;

		// Register game state events
		document.addEventListener("scoreUpdated", this._updateScores);

		// Start rendering game frames
		requestAnimationFrame(this._renderFrame);
	}

	/**
	 * Update the scores text, which is displayed outside of the canvas in a regular HTML element.
	 * @param event The event containing the new scores of player 1 and player 2.
	*/
	private _updateScores = (ev: CustomEventInit) => {
		this._scores.innerText = `${ev.detail.p1} : ${ev.detail.p2}`;
	}

	/**
	 * Draws the text indicating the game is paused. The reason is automatically fetched from the game state and displayed too.
	 */
	private _renderPausedText = () => {
		this._ctx.save();
		this._ctx.fillStyle = "#fff";
		this._ctx.font = "48px 'Common Pixel'";
		this._ctx.textAlign = "center";
		this._ctx.fillText("GAME PAUSED", this._canvas.width * 0.5, this._canvas.height * 0.5);
		this._ctx.restore();

		this._ctx.save();
		this._ctx.font = "24px 'Common Pixel'";
		this._ctx.fillStyle = "#999";
		this._ctx.textAlign = "center";
		this._ctx.fillText(PausedReason.getReason(this._gameState.isPaused()).toUpperCase(), this._canvas.width * 0.5, this._canvas.height * 0.5 + 48);
		this._ctx.restore();
	}

	/**
	 * Draws a dark overlay over the entire canvas. Useful for rendering the pause screen or other information.
	 */
	private _renderOverlay = () => {
		this._ctx.save();
		this._ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.restore();
	}

	/**
	 * Draws the line in the middle of the game, indicating which side is which player's.
	 */
	private _renderMiddleLine = () => {
		this._ctx.save();
		const grid = 7;
		for (let i = grid; i < this._canvas.height - grid; i += grid * 2) {
			this._ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
			this._ctx.fillRect(this._canvas.width * 0.5 - grid * 0.5, i, grid, grid);
		}
		this._ctx.restore();
	}

	/**
	 * Game drawing loop. Calls itself recursively using requestAnimationFrame.
	 */
	private _renderFrame = () => {
		// Clear canvas and draw background
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.fillStyle = "black";
		this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// Game objects
		this._gameState.ball.render(this._ctx);
		this._gameState.player1.paddle.render(this._ctx);
		this._gameState.player2.paddle.render(this._ctx);

		// Middle line
		this._renderMiddleLine();

		// Pause screen (if paused)
		if (this._gameState.isPaused() > 0) {
			this._renderOverlay();
			this._renderPausedText();
		}

		// Render next frame
		requestAnimationFrame(this._renderFrame);
	};
};

export default GameRenderer;

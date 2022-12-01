import { formatSeconds } from "$lib/Utils/Basic";
import type GameDebugger from "./Debugger";
import type { Dimensions, PausedReasonObject } from "./StateMachine";
import type GameStateMachine from "./StateMachine";

class GameRenderer {
	private _gameState: GameStateMachine;
	private _canvas: HTMLCanvasElement;
	private _ctx: CanvasRenderingContext2D;
	private _scores: HTMLElement;
	private _timer: HTMLElement;
	private _avatar1: HTMLImageElement;
	private _avatar2: HTMLImageElement;

	private _size: Dimensions;

	private _debugger: GameDebugger | undefined;
	debugScreen: boolean = false;
	private _lastFrameTime: number = 0;
	private _fps = 0;

	constructor(canvas: HTMLCanvasElement, gameState: GameStateMachine, scores: HTMLElement, timer: HTMLElement, avatar1: HTMLImageElement, avatar2: HTMLImageElement) {
		this._gameState = gameState;
		this._canvas = canvas;
		this._ctx = canvas.getContext("2d")!;
		this._scores = scores;
		this._timer = timer;
		this._avatar1 = avatar1;
		this._avatar2 = avatar2;

		this._size = { w: canvas.width, h: canvas.height };

		// Set up user data
		this._avatar1.src = this._gameState.player1.avatar;
		this._avatar2.src = this._gameState.player2.avatar;
		console.log(this._gameState.player1.avatar);
		console.log(this._avatar1.src);

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
		const pausedReason: PausedReasonObject | null = this._gameState.getPausedReason();
		this._ctx.save();
		this._ctx.fillStyle = "#fff";
		this._ctx.font = "48px 'Common Pixel'";
		this._ctx.textAlign = "center";
		this._ctx.fillText(pausedReason!.text.toUpperCase(), this._canvas.width * 0.5, this._canvas.height * 0.5);
		this._ctx.restore();

		this._ctx.save();
		this._ctx.font = "24px 'Common Pixel'";
		this._ctx.fillStyle = "#999";
		this._ctx.textAlign = "center";
		this._ctx.fillText(pausedReason!.reason.toUpperCase(), this._canvas.width * 0.5, this._canvas.height * 0.5 + 48);
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
	 * Draw debug information, such as the current FPS and movements.
	 */
	private _renderDebugScreen = () => {
		if (this._debugger)
			this._debugger.render(this._ctx, this._fps);
	}

	/**
	 * Game drawing loop. Calls itself recursively using requestAnimationFrame.
	 */
	private _renderFrame = () => {
		// Calculate FPS
		const now = performance.now();
		const delta = now - this._lastFrameTime;
		this._lastFrameTime = now;
		this._fps = Math.round(1000 / delta);

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

		// Timer
		this._timer.innerText = formatSeconds(this._gameState.getGameDuration() - this._gameState.getTimePlayed());

		// Pause screen (if paused)
		if (this._gameState.isPaused()) {
			this._renderOverlay();
			this._renderPausedText();
		}

		// Debug screen
		if (this.debugScreen)
			this._renderDebugScreen();

		// Render next frame
		requestAnimationFrame(this._renderFrame);
	};

	//= Public =//
	public setDebugger = (dbugger: GameDebugger) => {
		this._debugger = dbugger;
	}

	public getSize = (): Dimensions => {
		return this._size;
	}
};

export default GameRenderer;

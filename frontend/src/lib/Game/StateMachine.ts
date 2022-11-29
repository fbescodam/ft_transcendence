import type { Vec2, Dimensions, Direction } from "../Types";
import type GameTicker from "./Ticker";
import { LOCAL_MULTIPL_MODE_ID, type GameMode } from "./Modes";
import GameSoundEngine from "./SoundEngine";

/**
 * A base class for drawable 2d objects.
 */
abstract class GameObject {
	pos: Vec2;
	size: Dimensions;

	constructor(pos: Vec2, size: Dimensions) {
		this.pos = pos;
		this.size = size;
	}

	/**
	 * Renders the given object onto a context.
	 * @param ctx The canvas rendering context object.
	 */
	abstract render(ctx: CanvasRenderingContext2D): void;

	/**
	 * Check if two objects are intersecting
	 * @param objA Object A.
	 * @param objB Object B.
	 * @returns True if they intersect, else false.
	 */
	public static intersects = (objA: GameObject, objB: GameObject) => {
		return(
			objA.pos.x < objB.pos.x + objB.size.w &&
			objA.pos.x + objA.size.w > objB.pos.x &&
			objA.pos.y < objB.pos.y + objB.size.h &&
			objA.size.h + objA.pos.y > objB.pos.y
		)
	}

	/**
	 * Check if an object contains a point on the map.
	 * @param obj Object.
	 * @param point Point.
	 * @returns True if they intersect, else false.
	 */
	public static contains = (obj: GameObject, point: Vec2) => {
		return(
			obj.pos.x < point.x &&
			obj.pos.x + obj.size.w > point.x &&
			obj.pos.y < point.y &&
			obj.size.h + obj.pos.y > point.y
		)
	}

	/**
	 * Check if an object is at the given x position.
	 * @param obj Object.
	 * @param x X position.
	 * @returns True if they intersect, else false.
	 */
	public static atX = (obj: GameObject, x: number) => {
		return(
			obj.pos.x < x &&
			obj.pos.x + obj.size.w > x
		)
	}

	/**
	 * Check if an object is at the given y position.
	 * @param obj Object.
	 * @param y Y position.
	 * @returns True if they intersect, else false.
	 */
	public static atY = (obj: GameObject, y: number) => {
		return(
			obj.pos.y < y &&
			obj.size.h + obj.pos.y > y
		)
	}
}

////////////////////////////////////////////////////////////////////////////////

export class Ball extends GameObject {
	private _spawnPos: Vec2;
	private _spawnSpeed: number;
	dx: Direction = 0;
	dy: Direction = 0;
	speed: number;

	constructor(pos: Vec2, speed: number = 5, size: Dimensions = { w: 16, h: 16 }) {
		super(pos, size);
		this._spawnPos = { x: pos.x, y: pos.y };
		this._spawnSpeed = speed;
		this.speed = speed;
		this.reset();
	}

	//= Public =//

	/**
	 * Move the ball at the speed set in dx and dy.
	 */
	public move = () => {
		this.pos.x += this.dx;
		this.pos.y += this.dy;
	}

	/**
	 * Calculate the intersection point of the ball and a x-coordinate (useful for paddle).
	 * @param x The x position to calculate the y value for.
	 * @returns The y value at the given x position, or Infinity if the calculation is too complex or impossible.
	 */
	public intersectsAtY = (x: number): number => {
		const maxIterations = 64;
		const tempBall = new Ball({ x: this.pos.x, y: this.pos.y }, this.speed, this.size);
		tempBall.dx = this.dx;
		tempBall.dy = this.dy;
		for (let i = 0; i < maxIterations; i++) {
			if (GameObject.atX(tempBall, x))
				return tempBall.pos.y;
			tempBall.move();
		}
		return Infinity;
	};

	/**
	 * Reset the ball to its original position and speed.
	 * Chooses a random direction to throw the ball in.
	*/
	public reset = () => {
		this.pos.x = this._spawnPos.x;
		this.pos.y = this._spawnPos.y;
		this.speed = this._spawnSpeed;
		this.dx = (Math.random() > 0.5 ? -1: 1) * this.speed;
		this.dy = (Math.random() > 0.5 ? -1: 1) * this.speed;

		// TODO: dispatch event here
	}

	/**
	 * Render the ball.
	 * @param ctx The canvas rendering context object.
	 */
	public override render = (ctx: CanvasRenderingContext2D) => {
		ctx.save();
		ctx.beginPath();
		{
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		}
		ctx.closePath();
		ctx.restore();
	}
}

////////////////////////////////////////////////////////////////////////////////

export class Paddle extends GameObject {
	private _moveAxisSize: number;
	private _minY: number = 0;
	private _maxY: number = 0;
	private _maxMove: number = 16; // Max pixels to move per frame, in either direction
	private _position: "left" | "right";
	private _dy: Direction = 0;

	constructor(position: "left" | "right", gameSize: Dimensions, size: Dimensions = { w: 8, h: 180 }) {
		const pos: Vec2 = { x: (position == "left" ? 16 : gameSize.w - 16) - size.w * 0.5, y: gameSize.h * 0.5 - 100 * 0.5 };
		super(pos, size);
		this._dy = 0;
		this._position = position;
		this._moveAxisSize = gameSize.h;

		this._updateMaxOffscreen();
	}

	/**
	 * Update the limits of the paddle's off-screen movement based on its current size.
	 */
	private _updateMaxOffscreen = () => {
		const paddleOffScreenMax = this.size.h * 0.5;
		this._minY = -paddleOffScreenMax;
		this._maxY = this._moveAxisSize - this.size.h + paddleOffScreenMax;
	}

	//= Public =//

	/**
	 * Get the position of the paddle.
	 * @returns A string representing the paddle's position: either "left" or "right".
	 */
	public getPosition = () => {
		return this._position;
	}

	/**
	 * Get the maximum amount of pixels the paddle can move per frame.
	 * @returns The paddle's maximum volicity over the y axis.
	 */
	public getMaxMoveSpeed = () => {
		return this._maxMove;
	}

	/**
	 * Reduce the maximum speed of the paddle by 50%.
	 * Used to limit the AI's paddle speed.
	 */
	public limitMoveSpeed = () => {
		this._maxMove *= 0.5;
	}

	/**
	 * Set the direction to move the paddle in. This speed cannot exceed the paddle's maximum move speed (see getMaxMoveSpeed).
	 * @param dir The amount of pixels to move the paddle, every frame.
	 */
	public setMoveDirection = (dir: Direction) => {
		if (Math.abs(dir) > this._maxMove)
			dir = (dir < 0 ? -this._maxMove: this._maxMove);
		this._dy = dir;
	}

	/**
	 * Get the paddle's current moving direction.
	 * @returns The current velocity of the paddle over the y-axis.
	 */
	public getMoveDirection = () => {
		return this._dy;
	}

	/**
	 * Move the paddle. This function is supposed to be called every frame.
	 */
	public move = () => {
		let newPos = this.pos.y + this._dy;
		if (newPos < this._minY)
			newPos = this._minY;
		else if (newPos > this._maxY)
			newPos = this._maxY;
		this.pos.y = newPos;

		// TODO: dispatch event here
	}

	/**
	 * Set the height of the paddle. This will also update the paddle's maximum off-screen movement.
	 * Only making the paddle smaller was tested, but it might work for making it bigger too.
	 * @param newHeight The new height of the paddle.
	 */
	public setHeight = (newHeight: number) => {
		if (newHeight != this.size.h) {
			const oldHeight = this.size.h;
			this.size.h = newHeight;
			this._updateMaxOffscreen();

			// update position to keep the paddle in the same place
			const oldYBottom = this.pos.y + oldHeight;
			const newYBottom = this.pos.y + newHeight;
			const diff = oldYBottom - newYBottom;
			this.pos.y += diff * 0.5;

			// TODO: dispatch event here
		}
	}

	/**
	 * Decrease the size of the paddle by a given amount. Limited to 40 pixels.
	 * @param amount The amount of pixels to increase the paddle's height by.
	 * @returns The new height of the paddle in pixels
	 */
	public decreaseSize = (amount: number): number => {
		const newSize = this.size.h - amount;
		if (newSize < 40) // minimum height of 40 pixels
			return newSize;
		this.setHeight(newSize);
		return newSize;
	}

	/**
	 * Render the paddle. This function is supposed to be called every frame.
	 * @param ctx The canvas rendering context object.
	 */
	public override render = (ctx: CanvasRenderingContext2D) => {
		let radius = 16;
		if (this.size.w < 2 * radius) radius = this.size.w / 2;
		if (this.size.h < 2 * radius) radius = this.size.h / 2;

		ctx.save();
		ctx.beginPath();
		{
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
		}
		ctx.closePath();
		ctx.restore();
	}
}

////////////////////////////////////////////////////////////////////////////////

export class Player {
	score: number;
	name: string;
	avatar: string;
	paddle: Paddle;
	_ready: boolean;

	constructor(name: string, avatar: string, position: "left" | "right", gameSize: Dimensions) {
		this.score = 0;
		this.name = name;
		this.avatar = avatar;
		this._ready = false;

		// Initialize paddle
		this.paddle = new Paddle(position, gameSize);
	}

	//= Public =//

	markReady = () => {
		this._ready = true;
	}

	isReady = () => {
		return this._ready;
	}
}

////////////////////////////////////////////////////////////////////////////////

class GameEvent {
	private _dispatched: boolean = false;
	private _event: CustomEvent;

	constructor(type: string, detail: object) {
		this._event = new CustomEvent(type, { detail: detail });
	}

	/**
	 * Dispatch the event to the HTML document.
	 */
	public dispatch = () => {
		if (this._dispatched)
			throw new Error("GameEvent already dispatched");
		this._dispatched = true;
		document.dispatchEvent(this._event);
	}
}

export class ScoreUpdatedEvent extends GameEvent {
	constructor(p1: number, p2: number) {
		super("scoreUpdated", { p1, p2 });
	}
}

////////////////////////////////////////////////////////////////////////////////

export interface PausedReasonObject {
	id: number,
	text: string;
	reason: string;
}

export class PausedReason {
	/**
	 * This is ugly but it works. Check if a PausedReason was defined by this class.
	 * @param reason The reason to check.
	 * @returns True if the reason was defined by this class, false otherwise.
	 */
	public static isValidReason(pausedReason: PausedReasonObject) {
		return pausedReason.id >= 0 && pausedReason.id <= 7;
	}

	public static readonly PAUSED_BY_PLAYER: PausedReasonObject = { id: 0, text: "Game paused", reason: "You paused the game" };
	public static readonly PAUSED_BY_OPPONENT: PausedReasonObject = { id: 1, text: "Game paused", reason: "Your opponent paused the game" };
	public static readonly PAUSED_BY_SERVER: PausedReasonObject = { id: 2, text: "Game paused", reason: "The server paused the game" };
	public static readonly CONNECTION_LOST_RECON: PausedReasonObject = { id: 3, text: "Connection lost", reason: "Trying to reconnect..." };
	public static readonly CONNECTION_LOST_FINAL: PausedReasonObject = { id: 4, text: "Connection lost", reason: "Gave up on trying to reconnect. This game is now over." };
	public static readonly WAITING_FOR_OPPONENT: PausedReasonObject = { id: 5, text: "Please wait...", reason: "Waiting for your opponent to join the game" };
	public static readonly INITIALIZING_GAME: PausedReasonObject = { id: 6, text: "Please wait...", reason: "Setting up the game..." };
	public static readonly READY_SET_GO: PausedReasonObject = { id: 7, text: "Ready to play?", reason: "Press SPACE to start." };
	// When adding a reason here, make sure to update the isValidReason function above
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Handles the state of the game such as rendering, input control, ...
 *
 * @Note For now this will be all done on frontend, later this merley serves for
 * smoothing out stuff. Server will overwrite everything.
 */
class GameStateMachine {
	private _gameSize: Dimensions;
	private _gameMode: GameMode;
	private _gameSoundEngine: GameSoundEngine;
	private _paused: PausedReasonObject | null = PausedReason.READY_SET_GO;

	player1: Player;
	player2: Player;
	ball: Ball;

	constructor(gameTicker: GameTicker, gameWidth: number, gameHeight: number, gameMode: GameMode) {
		this._gameSize = { w: gameWidth, h: gameHeight };
		this._gameMode = gameMode;
		this._gameSoundEngine = new GameSoundEngine();

		this.ball = new Ball({ x: gameWidth * 0.5, y: gameHeight * 0.5 });
		this.player1 = new Player("Player 1", "", "left", this._gameSize);
		this.player2 = new Player("Player 2", "", "right", this._gameSize);

		// Run the game state machine every tick
		gameTicker.add(this._update);
	}

	/**
	 * Function to call when the ball was intercepted by a player's paddle.
	 * @param paddle The paddle that intercepted the ball.
	 */
	private _handleBallInterception = (paddle: Paddle) => {
		this.ball.speed *= 1.1; // Speed up with every ball interception by a paddle

		// Calculate the new direction of the ball
		const ball_dir = Math.atan2(this.ball.dx, this.ball.dy);
		const paddle_vy = this.ball.speed + 0.5 * paddle.getMoveDirection();
		let ball_vy = Math.cos(ball_dir) * this.ball.speed + 0.25 * paddle_vy;
		let ball_vx = -Math.sin(ball_dir) * this.ball.speed;
		this.ball.dx = ball_vx + (ball_vx < 0 ? -1 : 1); // Ternary to make sure the ball is not going straight up or down
		this.ball.dy = ball_vy;

		// Move the ball to the game side of the paddle to prevent clipping
		if (paddle.getPosition() == "left")
			this.ball.pos.x = this.player1.paddle.pos.x + this.player1.paddle.size.w;
		else
			this.ball.pos.x = this.player2.paddle.pos.x - this.ball.size.w;

		// Play a beeping sound
		this._gameSoundEngine.playBeep();

		// TODO: dispatch event here
	}

	/**
	 * Ticker function - this function is called every game tick.
	 */
	private _update = () => {
		if (this.isPaused()) {
			return;
		}

		// Did ball hit either left or right wall?
		const p1Win = this.ball.pos.x > this._gameSize.w;
		const p2Win = this.ball.pos.x < 0;
		if (p1Win || p2Win) {
			// If p1 won, add to p1 score
			if (p1Win) {
				this.player1.score++;
				this.player1.paddle.decreaseSize(16);
			}
			else {
				this.player2.score++;
				this.player2.paddle.decreaseSize(16);
			}

			this.ball.reset();

			// Dispatch score updated event
			new ScoreUpdatedEvent(this.player1.score, this.player2.score).dispatch();
		}
		// Check paddle intersection on left
		else if (GameObject.intersects(this.ball, this.player1.paddle)) {
			this._handleBallInterception(this.player1.paddle);
		}
		// Check paddle intersection on right
		else if (GameObject.intersects(this.ball, this.player2.paddle)) {
			this._handleBallInterception(this.player2.paddle);
		}
		// Ball hit top or bottom wall
		else if (this.ball.pos.y + this.ball.dy > this._gameSize.h - this.ball.size.h ||
					this.ball.pos.y + this.ball.dy < 0) {
			this.ball.dy *= -1;

			// Play a beeping sound
			this._gameSoundEngine.playBoop();

			// TODO: dispatch event here
		}

		// Update positions
		this.ball.move();
		this.player1.paddle.move();
		this.player2.paddle.move();
	}

	//= Public =//

	/**
	 * Get the game mode of the current game.
	 * @returns The current game mode.
	 */
	public getGameMode = () => {
		return this._gameMode;
	}

	/**
	 * Start the game: mark player 1 as ready.
	 * Note: in local multiplayer, it marks both players as ready and starts the game.
	 */
	public startGame = () => {
		this.player1.markReady();

		// If we're in local multiplayer, mark player 2 as ready as well
		if (this.getGameMode() == LOCAL_MULTIPL_MODE_ID) {
			this.player2.markReady();
		}

		// Check if player 2 is ready
		// Always perform this check: in singleplayer, the AI needs to be ready too!
		if (!this.player2.isReady()) {
			this._paused = PausedReason.WAITING_FOR_OPPONENT;
		}
		else {
			this._paused = null;
		}
	}

	/**
	 * Pause the game.
	 * @param reason The reason for the pause. See PausedReason for more info.
	 * @returns True if the game is now paused, false if it was already paused.
	 */
	public pauseGame = (reason: PausedReasonObject): boolean => {
		if (this._paused)
			return false;

		if (!PausedReason.isValidReason(reason))
			throw new Error("Invalid pause reason: " + reason);
		this._paused = reason;
		return true;
	}

	/**
	 * Unpause the game.
	 * @returns True if the game was unpaused, false if remains paused.
	 */
	public unPauseGame = (): boolean => {
		if (this._paused) {
			this._paused = null;
			return true;
		}
		return false;
	}

	/**
	 * Check if the game is paused.
	 * @returns True if the game is paused, false if it is not.
	 */
	public isPaused = (): boolean => {
		return this._paused != null;
	}

	/**
	 * Get the reason for the game being paused.
	 * @returns The reason (see PausedReason for more info). NULL if the game is not paused.
	 */
	public getPausedReason = (): PausedReasonObject | null => {
		return this._paused;
	}
}

export default GameStateMachine;

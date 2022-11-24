
import type { Vec2, Dimensions, SimpleDirection, ComplexDirection } from "../Types";
import type GameTicker from "./Ticker";
import type { GameMode } from "./Modes";

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
	 * Check if these two objects intersecting
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
}

////////////////////////////////////////////////////////////////////////////////

class Ball extends GameObject {
	private _spawnPos: Vec2;
	private _spawnSpeed: number;
	dx: ComplexDirection = 0;
	dy: ComplexDirection = 0;
	speed: number;

	constructor(pos: Vec2, speed: number = 4, size: Dimensions = { w: 16, h: 16 }) {
		super(pos, size);
		this._spawnPos = { x: pos.x, y: pos.y };
		this._spawnSpeed = speed;
		this.speed = speed;
		this.reset();
	}

	//= Public =//

	public move = () => {
		this.pos.x += this.dx;
		this.pos.y += this.dy;
	}

	public reset = () => {
		this.pos.x = this._spawnPos.x;
		this.pos.y = this._spawnPos.y;
		this.speed = this._spawnSpeed;
		this.dx = (Math.random() > 0.5 ? -1: 1) * this.speed;
		this.dy = (Math.random() > 0.5 ? -1: 1) * this.speed;
	}

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

class Paddle extends GameObject {
	private _moveAxisSize: number;
	private _minY: number = 0;
	private _maxY: number = 0;
	private _position: "left" | "right";
	dy: SimpleDirection = 0;
	speed: number;

	constructor(position: "left" | "right", gameSize: Dimensions, speed: number = 16, size: Dimensions = { w: 8, h: 180 }) {
		const pos: Vec2 = { x: (position == "left" ? 16 : gameSize.w - 16) - size.w * 0.5, y: gameSize.h * 0.5 - 100 * 0.5 };
		super(pos, size);
		this.dy = 0;
		this.speed = speed;
		this._position = position;
		this._moveAxisSize = gameSize.h;

		this._updateMaxOffscreen();
	}

	private _updateMaxOffscreen = () => {
		const paddleOffScreenMax = this.size.h * 0.5;
		this._minY = -paddleOffScreenMax;
		this._maxY = this._moveAxisSize - this.size.h + paddleOffScreenMax;
	}

	//= Public =//

	public getPosition = () => {
		return this._position;
	}

	public move = () => {
		let newPos = this.pos.y + this.dy * this.speed;
		if (newPos < this._minY)
			newPos = this._minY;
		else if (newPos > this._maxY)
			newPos = this._maxY;
		this.pos.y = newPos;
	}

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
		}
	}

	public decreaseSize = (amount: number) => {
		const newSize = this.size.h - amount;
		if (newSize < 40) // minimum height of 40 pixels
			return;
		this.setHeight(newSize);
	}

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

class PlayerState {
	score: number;
	name: string;
	avatar: string;
	paddle: Paddle;

	constructor(name: string, avatar: string, position: "left" | "right", gameSize: Dimensions) {
		this.score = 0;
		this.name = name;
		this.avatar = avatar;

		// initialize paddle
		this.paddle = new Paddle(position, gameSize);
	}
}

////////////////////////////////////////////////////////////////////////////////

class GameEvent {
	private _dispatched: boolean = false;
	private _event: CustomEvent;

	constructor(type: string, detail: object) {
		this._event = new CustomEvent(type, { detail: detail });
	}

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

/**
 * Handles the state of the game such as rendering, input control, ...
 *
 * @Note For now this will be all done on frontend, later this merley serves for
 * smoothing out stuff. Server will overwrite everything.
 */
class GameStateMachine {
	private _gameSize: Dimensions;
	private _gameMode: GameMode;

	player1: PlayerState;
	player2: PlayerState;
	ball: Ball;
	paused: boolean = false;

	constructor(gameTicker: GameTicker, gameWidth: number, gameHeight: number, gameMode: GameMode) {
		this._gameSize = { w: gameWidth, h: gameHeight };
		this._gameMode = gameMode;

		this.ball = new Ball({ x: gameWidth * 0.5, y: gameHeight * 0.5 });
		this.player1 = new PlayerState("Player 1", "", "left", this._gameSize);
		this.player2 = new PlayerState("Player 2", "", "right", this._gameSize);

		// Run the game state machine every tick
		gameTicker.add(this._update);
	}

	private _handleBallInterception = (paddle: Paddle) => {
		this.ball.speed *= 1.075; // Speed up with every ball interception by a paddle
		// this.ball.dx *= -1; // Make the ball go the other direction (on the x axis)

		// Calculate the new direction of the ball
		// Constant k defines how much the ball will be deflected by the paddle's vy
		const k = 0.25;
		const ball_dir = Math.atan2(this.ball.dx, this.ball.dy);
		const paddle_vy = paddle.speed * paddle.dy;
		let ball_vy = Math.cos(ball_dir) * this.ball.speed + k * paddle_vy;
		let ball_vx = -Math.sin(ball_dir) * this.ball.speed;
		this.ball.dx = ball_vx;
		this.ball.dy = ball_vy;

		if (paddle.getPosition() == "left")
			this.ball.pos.x = this.player1.paddle.pos.x + this.player1.paddle.size.w;
		else
			this.ball.pos.x = this.player2.paddle.pos.x - this.ball.size.w;
	}

	private _update = () => {
		if (this.paused)
			return;

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
		}

		// Update positions
		this.ball.move();
		this.player1.paddle.move();
		this.player2.paddle.move();
	}

	//= Public =//

	public getGameMode = () => {
		return this._gameMode;
	}
}

export default GameStateMachine;

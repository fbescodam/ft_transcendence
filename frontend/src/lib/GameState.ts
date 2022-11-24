
import type { GameMode } from "./Modes";
export type Vec2 = { x: number, y: number }
export type SimpleDirection = 1 | 0 | -1;
export type Dimensions = { w: number, h: number };

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
	public static intersects(objA: GameObject, objB: GameObject) {
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
	dx: SimpleDirection = 0;
	dy: SimpleDirection = 0;
	speed: number;

	constructor(pos: Vec2, speed: number = 4, size: Dimensions = { w: 16, h: 16 }) {
		super(pos, size);
		this._spawnPos = { x: pos.x, y: pos.y };
		this._spawnSpeed = speed;
		this.speed = speed;
		this.reset();
	}

	//= Public =//

	public move() {
		this.pos.x += this.dx * this.speed;
		this.pos.y += this.dy * this.speed;
	}

	public reset() {
		this.pos.x = this._spawnPos.x;
		this.pos.y = this._spawnPos.y;
		this.speed = this._spawnSpeed;
		this.dx = Math.random() > 0.5 ? -1: 1;
		this.dy = Math.random() > 0.5 ? -1: 1;
	}

	public override render(ctx: CanvasRenderingContext2D) {
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
	dy: SimpleDirection = 0;
	speed: number;

	constructor(position: "left" | "right", gameSize: Dimensions, speed: number = 16, size: Dimensions = { w: 8, h: 128 }) {
		const pos: Vec2 = { x: (position == "left" ? 16 : gameSize.w - 16) - size.w * 0.5, y: gameSize.h * 0.5 - 100 * 0.5 };
		super(pos, size);
		this.dy = 0;
		this.speed = speed;
	}

	//= Public =//

	public move() {
		this.pos.y += this.dy * this.speed;
	}

	public override render(ctx: CanvasRenderingContext2D): void {
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

	//= Public =//

	// TODO: make own
	// public render(ctx: CanvasRenderingContext2D) {
	// 	ctx.save();
	// 	ctx.beginPath();
	// 	{
	// 		ctx.fillStyle = "#fff";
	// 		ctx.font = "48px sans-serif";
	// 		ctx.textAlign = "center";
	// 		ctx.fillText(`${this.p1}`, 100, 50);
	// 		ctx.fillText(`${this.p2}`, 700, 50);
	// 	}
	// 	ctx.closePath();
	// 	ctx.restore();
	// }
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
	private _tickRate: number;

	player1: PlayerState;
	player2: PlayerState;
	ball: Ball;
	paused: boolean = false;

	constructor(gameWidth: number, gameHeight: number, gameMode: GameMode, tickRate: number = 60) {
		this._gameSize = { w: gameWidth, h: gameHeight };
		this._gameMode = gameMode;
		this._tickRate = tickRate;

		this.ball = new Ball({ x: gameWidth * 0.5, y: gameHeight * 0.5 });
		this.player1 = new PlayerState("Player 1", "", "left", this._gameSize);
		this.player2 = new PlayerState("Player 2", "", "right", this._gameSize);

		// start "physics" loop
		setInterval(() => this._update(), 1000 / this._tickRate);
	}

	private _update() {
		if (this.paused)
			return;

		// Did ball hit either wall?
		const p1Win = this.ball.pos.x > this._gameSize.w;
		const p2Win = this.ball.pos.x < 0;
		if (p1Win || p2Win) {
			// If p1 won, add to p1 score
			if (p1Win)
				this.player1.score++;
			else
				this.player2.score++;

			this.ball.reset();
		}
		// Check baddle intersection
		else if (GameObject.intersects(this.ball, this.player1.paddle) ||
				GameObject.intersects(this.ball, this.player2.paddle)) {
			this.ball.dx *= -1;
			this.ball.dy *= 1;
			this.ball.speed *= 1.05; // Speed up with every intersect
		}
		// Ball hit top or bottom wall
		else if (this.ball.pos.y + this.ball.dy > this._gameSize.h - this.ball.size.h ||
					this.ball.pos.y + this.ball.dy < 0) {
			this.ball.dy *= -1;
		}

		// update positions
		this.ball.move();
		this.player1.paddle.move();
		this.player2.paddle.move();
	}

	//= Public =//

	public getGameMode() {
		return this._gameMode;
	}
}

export default GameStateMachine;

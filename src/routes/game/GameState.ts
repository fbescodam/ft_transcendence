
export type Vec2 = { x: number, y: number }

/**
 * A base class for drawable 2d objects.
 */
abstract class Object {
	pos: { x: number, y: number };
	width: number;
	height: number;

	constructor(pos: Vec2, width: number, height: number) {
		this.pos = pos;
		this.width = width;
		this.height = height;
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
	public static intersects(objA: Object, objB: Object) {
		return(
			objA.pos.x < objB.pos.x + objB.width &&
			objA.pos.x + objA.width > objB.pos.x &&
			objA.pos.y < objB.pos.y + objB.height &&
			objA.height + objA.pos.y > objB.pos.y
		)
	}
}

////////////////////////////////////////////////////////////////////////////////

class Ball extends Object {
	constructor(pos: Vec2, width: number, height: number) {
		super(pos, width, height);
	}

	//= Public =//

	public move(vec: Vec2) {
        this.pos.x += vec.x;
        this.pos.y += vec.y;
	}

	public override render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.beginPath();
		{
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
		}
		ctx.closePath();
		ctx.restore();
	}
}

////////////////////////////////////////////////////////////////////////////////

class Paddle extends Object {
	constructor(pos: Vec2, width: number, height: number) {
		super(pos, width, height);
	}

	//= Public =//

	public override render(ctx: CanvasRenderingContext2D): void {
		let radius = 16;
		if (this.width < 2 * radius) radius = this.width / 2;
		if (this.height < 2 * radius) radius = this.height / 2;

		ctx.save();
		ctx.beginPath();
		{
			ctx.strokeStyle = "#ccc";
			ctx.fillStyle = "#fff";
			ctx.moveTo(this.pos.x + radius, this.pos.y);
			ctx.arcTo(
				this.pos.x + this.width,
				this.pos.y,
				this.pos.x + this.width,
				this.pos.y + this.height,
				radius
			);
			ctx.arcTo(
				this.pos.x + this.width,
				this.pos.y + this.height,
				this.pos.x,
				this.pos.y + this.height,
				radius
			);
			ctx.arcTo(
				this.pos.x,
				this.pos.y + this.height,
				this.pos.x,
				this.pos.y,
				radius
			);
			ctx.arcTo(
				this.pos.x,
				this.pos.y,
				this.pos.x + this.width,
				this.pos.y,
				radius
			);
			ctx.stroke();
			ctx.fill();
		}
		ctx.closePath();
		ctx.restore();
	}
}

////////////////////////////////////////////////////////////////////////////////

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

/**
 * Handles the state of the game such as rendering, input control, ...
 *
 * @Note For now this will be all done on frontend, later this merley serves for
 * smoothing out stuff. Server will overwrite everything.
 */
class GameStateMachine {

    score: Vec2;
	paddleP1: Paddle; // Left
	paddleP2: Paddle; // Right
	ball: Ball;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

    // TODO: Implement custom vector instead
	dx: number;
	dy: number;

	constructor(canvas: HTMLCanvasElement, score: Vec2) {
        this.score = score;
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;

        this.ball = new Ball({ x: this.canvas.width / 2, y: this.canvas.height / 2 }, 16, 16);

		const paddleWidth = 10;
		const paddleHeight = 100;

		// Disgusting to read but basic math to center and offset both paddles to the middle
        this.paddleP1 = new Paddle({ x: paddleWidth, y: canvas.height / 2 - 100 / 2 }, paddleWidth, paddleHeight);
        this.paddleP2 = new Paddle({ x: canvas.width - (paddleWidth * 2), y: canvas.height / 2 - 100 / 2 }, paddleWidth, paddleHeight);

		const speed = 4;
		this.dx = Math.random() > 0.5 ? -speed : speed;
		this.dy = Math.random() > 0.5 ? -speed : speed;
	}
	
	// TODO: Refactor!
	public animate = () => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const p2Win = this.ball.pos.x < 0;
		const p1Win = this.ball.pos.x > this.canvas.width;

		if (p1Win || p2Win) {
			this.ball.pos = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
			this.dx = Math.random() > 0.5 ? -4 : 4;
			this.dy = Math.random() > 0.5 ? -4 : 4;

			if (p1Win)
				this.score.x++;
			else
				this.score.y++;
		}
		// Check baddle intersection
		else if (Object.intersects(this.ball, this.paddleP1) || 
			Object.intersects(this.ball, this.paddleP2)) {
			this.dx *= -1.2;
			this.dy *= 1.2;
		}
		// Y-Up || Y-Down
		else if (this.ball.pos.y + this.dy > this.canvas.height - this.ball.height || 
			this.ball.pos.y + this.dy < 0) {
			this.dy *= -1;
		}

		this.ball.move({ x: this.dx, y: this.dy });

		this.paddleP2.pos = { x: this.paddleP2.pos.x, y: this.ball.pos.y };
		this.ball.render(this.ctx);
		this.paddleP1.render(this.ctx);
		this.paddleP2.render(this.ctx);

		
		const grid = 7;
		for (let i = grid; i < this.canvas.height - grid; i += grid * 2) {
			this.ctx.fillStyle = "#fff"
			this.ctx.fillRect(this.canvas.width / 2 - grid / 2, i, grid, grid);
		}
	};
}

export default GameStateMachine;
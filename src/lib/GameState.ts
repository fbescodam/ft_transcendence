import type { Vec2 } from "./Types";

/** A base class for drawable 2d objects. */
abstract class Object {
    pos: Vec2;
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
        return (
            objA.pos.x < objB.pos.x + objB.width &&
            objA.pos.x + objA.width > objB.pos.x &&
            objA.pos.y < objB.pos.y + objB.height &&
            objA.height + objA.pos.y > objB.pos.y
        );
    }
}

////////////////////////////////////////////////////////////////////////////////

/** The ball used in the game. */
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

/** Player controlled paddle to block the ball. */
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
			ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
            ctx.stroke();
            ctx.fill();
        }
        ctx.closePath();
        ctx.restore();
    }
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Handles the state of the game such as rendering, input control, ...
 *
 * @Note The frontend will only handle the game for local play and for multiplayer
 * it is to prevent lag.
 */
class GameStateMachine {
    public ball: Ball;
    public score: Vec2;
    public paddleP1: Paddle;
    public paddleP2: Paddle;
    public ballVelocity: Vec2;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
	private initialSpeed: number = 4;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.score = { x: 0, y: 0 };
        this.ctx = canvas.getContext("2d")!;

        // Create ball in the middle of the canvas.
        this.ball = new Ball({ x: this.canvas.width / 2, y: this.canvas.height / 2 }, 16, 16);

        const paddleWidth = 10;
        const paddleHeight = 100;
        this.paddleP1 = new Paddle(
			{ x: paddleWidth, y: canvas.height / 2 - 100 / 2 }, 
			paddleWidth, 
			paddleHeight);
        this.paddleP2 = new Paddle(
            { x: canvas.width - paddleWidth * 2, y: canvas.height / 2 - 100 / 2 },
            paddleWidth,
            paddleHeight
        );
        this.ballVelocity = {
            x: Math.random() > 0.5 ? -this.initialSpeed : this.initialSpeed,
            y: Math.random() > 0.5 ? -this.initialSpeed : this.initialSpeed,
        };
    }

	public animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Is ball beyond the canvas in the X direction ?
		const p2Win = this.ball.pos.x < 0;
        const p1Win = this.ball.pos.x > this.canvas.width;

        if (p1Win || p2Win) {
            this.ball.pos = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
			this.ballVelocity = {
				x: Math.random() > 0.5 ? -this.initialSpeed : this.initialSpeed,
				y: Math.random() > 0.5 ? -this.initialSpeed : this.initialSpeed,
			};

            if (p1Win)
				this.score.x++;
            else
				this.score.y++;
        }
        // Check paddle intersection
        else if (Object.intersects(this.ball, this.paddleP1) || Object.intersects(this.ball, this.paddleP2)) {
            this.ballVelocity.x *= -1.2;
            this.ballVelocity.y *= 1.2;
        }
        // Y-Up || Y-Down
        else if (this.ball.pos.y + this.ballVelocity.y > this.canvas.height - this.ball.height || this.ball.pos.y + this.ballVelocity.y < 0) {
            this.ballVelocity.y *= -1;
        }

        this.ball.move(this.ballVelocity);

		// Render ball and paddles
		this.ball.render(this.ctx);
        this.paddleP1.render(this.ctx);
        this.paddleP2.render(this.ctx);

		// Draw middle divider
		const grid = 7;
        for (let i = grid; i < this.canvas.height - grid; i += grid * 2) {
            this.ctx.fillStyle = "#fff";
            this.ctx.fillRect(this.canvas.width / 2 - grid / 2, i, grid, grid);
        }
	}
}

export default GameStateMachine;

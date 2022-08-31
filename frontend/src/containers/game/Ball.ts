import Logger from "../../utils/Logger";
import { Vec2, Vec3 } from "../../utils/Vector";
import GameState from "./GameState";
import Paddle from "./Paddle";

/**
 * A paddle that can be controlled and block the incoming ball.
 */
class Ball {
	/** The speed of the ball.*/
	public speed: number;
	/** The position of the ball.*/
	public position: Vec2;
	/** The direction of the ball.*/
	public direction: Vec2;

	/** The ball is frozen, as in, shall not move. */
	private freeze: boolean = true;
	/** The initial given position, used for reset. */
	private initialPos: Vec2;
	/** The game state. */
	private gameState: GameState;

	/**
	 * Creates a new ball entity.
	 * @param inPosition The position at which to spawn the ball.
	 * @param inSpeed The ball speed.
	 * @param inDirection The initial direction the ball should go.
	 */
	constructor(inPosition: Vec2, inSpeed: number, inDirection: Vec2, inGameState: GameState) {
		this.position = this.initialPos = inPosition;
		this.speed = inSpeed;
		this.direction = inDirection;
		this.gameState = inGameState;
	}
	
	/** Enable the balls movement */
	public start() {
		this.freeze = false;
	}
	
	/** Disable the balls movement */
	public stop(reset: boolean = false) {
		this.freeze = true;

		if (reset) {
			this.position.x = this.initialPos.x; 
			this.position.y = this.initialPos.y;
		}
	}

	/** Update the state of the ball, e.g: movement. */
	public update() {
		if (this.freeze) 
			return;

		// Technically multiply by delta time
		let moveDir: Vec2 = Vec2.addN(this.direction, this.speed);

		this.position.x = moveDir.x;
		this.position.y = moveDir.y;
	}

	/**
	 * hanldes a hit.
	 * @param hitPos The hit position.
	 */
	public hit(): string {

		// TODO: properly check intersections.

		return ("wall");
	}
}

export default Ball;

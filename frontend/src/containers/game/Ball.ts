import Logger from "../../utils/Logger";
import { Vec2, Vec3 } from "../../utils/Types";

/**
 * A paddle that can be controlled and block the incoming ball.
 */
class Ball {
	/** The speed of the ball.*/
	public speed: Number;
	/** The position of the ball.*/
	public position: Vec2;
	/** The direction of the ball.*/
	public direction: Vec3;

	/**
	 * Creates a new ball entity.
	 * @param inPosition The position at which to spawn the ball.
	 * @param inSpeed The ball speed.
	 * @param inDirection The initial direction the ball should go.
	 */
	constructor(inPosition: Vec2, inSpeed: number, inDirection: Vec3) {
		this.position = inPosition;
		this.speed = inSpeed;
		this.direction = inDirection;
	}
}

export default Ball;

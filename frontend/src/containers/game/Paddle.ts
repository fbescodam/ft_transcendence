import Logger from "../../utils/Logger"
import { Vec2 } from "../../utils/Types";

/**
 * A paddle that can be controlled and block the incoming ball.
 */
class Paddle {
    /** The movement speed of the paddle.*/
    public speed: Number;
    /** The position of the paddle.*/
    public position: Vec2;

    /**
     * Creates a new paddle entity, used by the player to deflect a @see Ball
     * @param inPosition The position at which to spawn the paddle.
     * @param inSpeed The paddle movement speed.
     */
    constructor(inPosition: Vec2, inSpeed: number) {
        this.position = inPosition;
        this.speed = inSpeed;
    }
}

export default Paddle;
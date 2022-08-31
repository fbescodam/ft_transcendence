import Logger from "../../utils/Logger"
import { Vec2 } from "../../utils/Vector";
import GameState from "./GameState";

/**
 * A paddle that can be controlled and block the incoming ball.
 */
class Paddle {
    /** The movement speed of the paddle.*/
    public speed: number;
    /** The position of the paddle.*/
    public position: Vec2;

	/** The game state. */
	private gameState: GameState;

    /**
     * Creates a new paddle entity, used by the player to deflect a @see Ball
     * @param inPosition The position at which to spawn the paddle.
     * @param inSpeed The paddle movement speed.
     */
    constructor(inPosition: Vec2, inSpeed: number, inGameState: GameState) {
        this.position = inPosition;
        this.speed = inSpeed;
		this.gameState = inGameState;
    }

	/** Update the state of the ball, e.g: movement. */
	public update() {
		
	}
}

export default Paddle;
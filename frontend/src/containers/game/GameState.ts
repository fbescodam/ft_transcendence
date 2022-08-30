import Logger from "../../utils/Logger";
import { Score } from "../../utils/Types";
import Ball from "./Ball";
import Paddle from "./Paddle";

/**
 * A game state keeps track of the current state the game.
 * 
 * How it will work:
 * 
 * 1. Player 1 starts, meaning ball will be sent towards the direction of Player 1's paddle.
 * 2. In case of rematch, we alternate the direction.
 * 3. We start slow but at a hit we speed up only once.
 * 4. Depending on where we hit the paddle we send it towards the direction of a spherical normal of the paddle.
 * 5. Server has its own game state and verifies and updates the gamestate of clients.
 * 6. We only ever update each hit, meaning we calculate a direction vector to where the ball will go and a distance.
 * This keeps updates to a minimum, clients merely replicate the incoming data from the server and then on it inform the server that it has happened.
 */
class GameState {
	/** Current score of Player 1 & 2.*/
	public score: Score = {p1: 0, p2: 0};

	/** The ball.*/
	public ball: Ball;
	/** Current score of Player 1.*/
	public p1Paddle: Paddle;
	/** Current score of Player 2.*/
	public p2Paddle: Paddle;

	/** The canvas element.*/
	private canvas: HTMLCanvasElement;
	/** The canvas drawing context*/
	private CTX: CanvasRenderingContext2D;

	constructor(inCanvas: HTMLCanvasElement, inCTX: CanvasRenderingContext2D) {
		this.canvas = inCanvas;
		this.CTX = inCTX;
		this.p1Paddle = new Paddle({x: 0, y: 0}, 0);
		this.p2Paddle = new Paddle({x: 0, y: 0}, 0);
		this.ball = new Ball({x: 0, y: 0}, 0, {x: 0, y: 0, z: 0});
	}
}

export default GameState;

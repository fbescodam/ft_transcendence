import Logger from "../../utils/Logger";
import Ball from "./Ball";
import Paddle from "./Paddle";

/**
 * A game state keeps track of the current state the game.
 */
class GameState {
	/** Current score of Player 1.*/
	public p1Score: number = 0;
	/** Current score of Player 2.*/
	public p2Score: number = 0;

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

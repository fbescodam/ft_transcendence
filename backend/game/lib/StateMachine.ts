import type GameTicker from "./Ticker";
import { LOCAL_MULTIPL_MODE_ID, ONLINE_MULTIPL_MODE_ID, type GameMode } from "./Modes";
import type { OnlineGameState, OnlinePlayerState } from "./NetworkHandler";

// Basic types
export type Vec2 = { x: number; y: number };
export type Direction = number;
export type Dimensions = { w: number; h: number };

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
	 * Check if two objects are intersecting
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

	/**
	 * Check if an object contains a point on the map.
	 * @param obj Object.
	 * @param point Point.
	 * @returns True if they intersect, else false.
	 */
	public static contains = (obj: GameObject, point: Vec2) => {
		return(
			obj.pos.x < point.x &&
			obj.pos.x + obj.size.w > point.x &&
			obj.pos.y < point.y &&
			obj.size.h + obj.pos.y > point.y
		)
	}

	/**
	 * Check if an object is at the given x position.
	 * @param obj Object.
	 * @param x X position.
	 * @returns True if they intersect, else false.
	 */
	public static atX = (obj: GameObject, x: number) => {
		return(
			obj.pos.x < x &&
			obj.pos.x + obj.size.w > x
		)
	}

	/**
	 * Check if an object is at the given y position.
	 * @param obj Object.
	 * @param y Y position.
	 * @returns True if they intersect, else false.
	 */
	public static atY = (obj: GameObject, y: number) => {
		return(
			obj.pos.y < y &&
			obj.size.h + obj.pos.y > y
		)
	}
}

////////////////////////////////////////////////////////////////////////////////

export class Ball extends GameObject {
	private _spawnPos: Vec2;
	private _spawnSpeed: number;
	dx: Direction = 0;
	dy: Direction = 0;
	speed: number;

	constructor(pos: Vec2, speed: number = 5, size: Dimensions = { w: 16, h: 16 }) {
		super(pos, size);
		this._spawnPos = { x: pos.x, y: pos.y };
		this._spawnSpeed = speed;
		this.speed = speed;
		this.reset();
	}

	//= Public =//

	/**
	 * Move the ball at the speed set in dx and dy.
	 */
	public move = () => {
		this.pos.x += this.dx;
		this.pos.y += this.dy;
	}

	/**
	 * Calculate the intersection point of the ball and a x-coordinate (useful for paddle).
	 * @param x The x position to calculate the y value for.
	 * @returns The y value at the given x position, or Infinity if the calculation is too complex or impossible.
	 */
	public intersectsAtY = (x: number): number => {
		const maxIterations = 64;
		const tempBall = new Ball({ x: this.pos.x, y: this.pos.y }, this.speed, this.size);
		tempBall.dx = this.dx;
		tempBall.dy = this.dy;
		for (let i = 0; i < maxIterations; i++) {
			if (GameObject.atX(tempBall, x))
				return tempBall.pos.y;
			tempBall.move();
		}
		return Infinity;
	};

	/**
	 * Reset the ball to its original position and speed.
	 * Chooses a random direction to throw the ball in.
	*/
	public reset = () => {
		this.pos.x = this._spawnPos.x;
		this.pos.y = this._spawnPos.y;
		this.speed = this._spawnSpeed;
		this.dx = (Math.random() > 0.5 ? -1: 1) * this.speed;
		this.dy = (Math.random() > 0.5 ? -1: 1) * this.speed;

		// TODO: dispatch event here
	}

	/**
	 * Render the ball.
	 * @param ctx The canvas rendering context object.
	 */
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

export class Paddle extends GameObject {
	private _moveAxisSize: number;
	private _minY: number = 0;
	private _maxY: number = 0;
	private _maxMove: number = 16; // Max pixels to move per frame, in either direction
	private _position: "left" | "right";
	private _dy: Direction = 0;

	constructor(position: "left" | "right", gameSize: Dimensions, size: Dimensions = { w: 8, h: 180 }) {
		const pos: Vec2 = { x: (position == "left" ? 16 : gameSize.w - 16) - size.w * 0.5, y: gameSize.h * 0.5 - 100 * 0.5 };
		super(pos, size);
		this._dy = 0;
		this._position = position;
		this._moveAxisSize = gameSize.h;

		this._updateMaxOffscreen();
	}

	/**
	 * Update the limits of the paddle's off-screen movement based on its current size.
	 */
	private _updateMaxOffscreen = () => {
		const paddleOffScreenMax = this.size.h * 0.5;
		this._minY = -paddleOffScreenMax;
		this._maxY = this._moveAxisSize - this.size.h + paddleOffScreenMax;
	}

	//= Public =//

	/**
	 * Get the position of the paddle.
	 * @returns A string representing the paddle's position: either "left" or "right".
	 */
	public getPosition = () => {
		return this._position;
	}

	/**
	 * Get the maximum amount of pixels the paddle can move per frame.
	 * @returns The paddle's maximum volicity over the y axis.
	 */
	public getMaxMoveSpeed = () => {
		return this._maxMove;
	}

	/**
	 * Reduce the maximum speed of the paddle by 50%.
	 * Used to limit the AI's paddle speed.
	 */
	public limitMoveSpeed = () => {
		this._maxMove *= 0.5;
	}

	/**
	 * Set the direction to move the paddle in. This speed cannot exceed the paddle's maximum move speed (see getMaxMoveSpeed).
	 * @param dir The amount of pixels to move the paddle, every frame.
	 */
	public setMoveDirection = (dir: Direction) => {
		if (Math.abs(dir) > this._maxMove)
			dir = (dir < 0 ? -this._maxMove: this._maxMove);
		this._dy = dir;
	}

	/**
	 * Get the paddle's current moving direction.
	 * @returns The current velocity of the paddle over the y-axis.
	 */
	public getMoveDirection = () => {
		return this._dy;
	}

	/**
	 * Move the paddle. This function is supposed to be called every frame.
	 * @returns Always returns true (for now?)
	 */
	public move = (): boolean => {
		let newPos = this.pos.y + this._dy;
		if (newPos < this._minY)
			newPos = this._minY;
		else if (newPos > this._maxY)
			newPos = this._maxY;
		this.pos.y = newPos;

		return true;
	}

	/**
	 * Set the height of the paddle. This will also update the paddle's maximum off-screen movement.
	 * Only making the paddle smaller was tested, but it might work for making it bigger too.
	 * @param newHeight The new height of the paddle.
	 * @returns True if the height was changed, false if the new height is the same as the current one.
	 */
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

			return true;
		}
		return false;
	}

	/**
	 * Decrease the size of the paddle by a given amount. Limited to 40 pixels.
	 * @param amount The amount of pixels to increase the paddle's height by.
	 * @returns The new height of the paddle in pixels
	 */
	public decreaseSize = (amount: number): number => {
		const newSize = this.size.h - amount;
		if (newSize < 40) // minimum height of 40 pixels
			return newSize;
		this.setHeight(newSize);
		return newSize;
	}

	/**
	 * Render the paddle. This function is supposed to be called every frame.
	 * @param ctx The canvas rendering context object.
	 */
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

export class Player {
	score: number;
	name: string;
	avatar: string;
	paddle: Paddle;
	_ready: boolean;

	constructor(name: string, avatar: string, position: "left" | "right", gameSize: Dimensions) {
		this.score = 0;
		this.name = name;
		this.avatar = avatar;
		this._ready = false;

		// Initialize paddle
		this.paddle = new Paddle(position, gameSize);
	}

	//= Public =//

	markReady = () => {
		console.warn(`Player ${this.name} is ready!`);
		this._ready = true;
	}

	isReady = () => {
		return this._ready;
	}

	getOnlineState = (): OnlinePlayerState => {
		return {
			score: this.score,
			ready: this.isReady(),
			name: this.name,
			avatar: this.avatar,
			paddle: {
				pos: this.paddle.pos,
				size: this.paddle.size,
				position: this.paddle.getPosition(),
				dy: this.paddle.getMoveDirection()
			}
		};
	}
}

////////////////////////////////////////////////////////////////////////////////

export interface PausedReasonObject {
	id: number,
	text: string;
	reason: string;
}

export class PausedReason {
	/**
	 * This is ugly but it works. Check if a PausedReason was defined by this class.
	 * @param reason The reason to check.
	 * @returns True if the reason was defined by this class, false otherwise.
	 */
	public static isValidReason(pausedReason: PausedReasonObject) {
		return pausedReason.id >= 0 && pausedReason.id <= 13;
	}

	public static readonly PAUSED_BY_PLAYER: PausedReasonObject = { id: 0, text: "Game paused", reason: "You paused the game" };
	public static readonly PAUSED_BY_OPPONENT: PausedReasonObject = { id: 1, text: "Game paused", reason: "Your opponent paused the game" };
	public static readonly PAUSED_BY_SERVER: PausedReasonObject = { id: 2, text: "Game paused", reason: "The server paused the game" };
	public static readonly CONNECTION_LOST_RECON: PausedReasonObject = { id: 3, text: "Connection lost", reason: "Trying to reconnect..." };
	public static readonly CONNECTION_LOST_FINAL: PausedReasonObject = { id: 4, text: "Connection lost", reason: "Gave up on trying to reconnect. This game is now over." };
	public static readonly WAITING_FOR_OPPONENT: PausedReasonObject = { id: 5, text: "Please wait...", reason: "Waiting for your opponent to join the game" };
	public static readonly INITIALIZING_GAME: PausedReasonObject = { id: 6, text: "Please wait...", reason: "Setting up the game..." };
	public static readonly READY_SET_GO: PausedReasonObject = { id: 7, text: "Ready to play?", reason: "Press SPACE to start." };
	public static readonly GAME_OVER: PausedReasonObject = { id: 8, text: "Game over", reason: "You lost. Better luck next time!" };
	public static readonly GAME_WON: PausedReasonObject = { id: 9, text: "Congratulations", reason: "You won! Well done." };
	public static readonly GAME_WON_LOCAL_P1: PausedReasonObject = { id: 10, text: "Game over", reason: "Player 1 has won the game." };
	public static readonly GAME_WON_LOCAL_P2: PausedReasonObject = { id: 11, text: "Game over", reason: "Player 2 has won the game." };
	public static readonly GAME_TIED: PausedReasonObject = { id: 12, text: "Game over", reason: "The game ended in a tie." };
	public static readonly GAME_OPPONENT_LEFT: PausedReasonObject = { id: 13, text: "Congratulations", reason: "Your opponent has given up, you win!" };
	// When adding a reason here, make sure to update the isValidReason function above
}

////////////////////////////////////////////////////////////////////////////////

// necessities for the game initialization

/**
 * Game state handling functions.
 */
export interface GameStateHandlers {
	/**
	 * Called when the score is updated.
	 */
	onScoreUpdated: (p1: number, p2: number) => void;

	/**
	 * Called when a "beep" sound should be played.
	 */
	onBeepSound: () => void;

	/**
	 * Called when a "boop" sound should be played.
	 */
	onBoopSound: () => void;

	/**
	 * Called when the game state changes so much that the state should be sent to the client.
	 * Only applies to online games, in the server's state machine.
	 * @param state The state of the game to send to the client.
	 */
	onImportantStateChange: (state: OnlineGameState) => void;
}

/**
 * Partial user interface, with only the necessities for the game to work.
 */
export interface User {
	id: number;
	name: string;
	intraName: string;
	avatar: string;
}

/**
 * Players holder interface
 */
export interface Players {
	p1: User;
	p2: User;
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
	private _paused: PausedReasonObject | null = PausedReason.READY_SET_GO;
	private _secondsPlayed: number = 0;
	private _gameDuration: number = 180; // 3 minutes

	private _gameStateHandlers: GameStateHandlers;
	private _isHost: boolean;

	player1: Player;
	player2: Player;
	ball: Ball;

	constructor(gameTicker: GameTicker, gameSize: Dimensions, gameMode: GameMode, players: Players, gameStateHandlers: GameStateHandlers, isHost: boolean = false) {
		this._gameSize = { w: gameSize.w, h: gameSize.h };
		this._gameMode = gameMode;
		this._gameStateHandlers = gameStateHandlers;
		this._isHost = isHost;

		this.ball = new Ball({ x: gameSize.w * 0.5, y: gameSize.h * 0.5 });
		this.player1 = new Player(players.p1.name, players.p1.avatar, "left", this._gameSize);
		this.player2 = new Player(players.p2.name, players.p2.avatar, "right", this._gameSize);

		// Run the game state machine every tick
		gameTicker.add(this._update);
	}

	/**
	 * Function to call when the ball was intercepted by a player's paddle.
	 * @param paddle The paddle that intercepted the ball.
	 */
	private _handleBallInterception = (paddle: Paddle) => {
		this.ball.speed *= 1.1; // Speed up with every ball interception by a paddle

		// Calculate the new direction of the ball
		// It is not a perfect reflection, but this is intended - the way it is now,
		// the gameplay is in general more fun, because it is a bit more random.
		const ball_dir = Math.atan2(this.ball.dx, this.ball.dy);
		const paddle_vy = this.ball.speed + 0.5 * paddle.getMoveDirection();
		let ball_vy = Math.cos(ball_dir) * this.ball.speed + 0.25 * paddle_vy;
		let ball_vx = -Math.sin(ball_dir) * this.ball.speed;
		this.ball.dx = ball_vx + (Math.abs(ball_vx) < 3 ? (ball_vx < 0 ? -3 : 3) : 0); // Ternary to make sure the ball is not going straight up or down
		this.ball.dy = ball_vy;

		// Move the ball to the game side of the paddle to prevent clipping
		if (paddle.getPosition() == "left")
			this.ball.pos.x = this.player1.paddle.pos.x + this.player1.paddle.size.w;
		else
			this.ball.pos.x = this.player2.paddle.pos.x - this.ball.size.w;

		// Play a beeping sound
		this._gameStateHandlers.onBeepSound();

		// If this state machine is acting as the host, send the new state to the listening clients
		if (this._isHost)
			this._gameStateHandlers.onImportantStateChange(this.getOnlineState());
	}

	private _gameEnd = () => {
		if (this._gameMode == LOCAL_MULTIPL_MODE_ID) {
			if (this.player1.score > this.player2.score)
				this._paused = PausedReason.GAME_WON_LOCAL_P1;
			else if (this.player1.score == this.player2.score)
				this._paused = PausedReason.GAME_TIED;
			else
				this._paused = PausedReason.GAME_WON_LOCAL_P2;
		}
		else {
			if (this.player1.score > this.player2.score)
				this._paused = PausedReason.GAME_WON;
			else if (this.player1.score == this.player2.score)
				this._paused = PausedReason.GAME_TIED;
			else
				this._paused = PausedReason.GAME_OVER;
		}
	}

	/**
	 * Ticker function - this function is called every game tick.
	 * @param tps The current ticks per second.
	 * @param deltaTick The time since the last tick in milliseconds.
	 */
	private _update = (tps: number, deltaTick: number) => {
		if (this.isPaused()) {
			return;
		}

		// Check if the game is over
		if (this._secondsPlayed >= this._gameDuration) {
			this._gameEnd();

			// Bugfix: prevent negative time from appearing
			this._secondsPlayed = this._gameDuration;

			// If this state machine is acting as the host, send the new state to the listening clients
			if (this._isHost)
				this._gameStateHandlers.onImportantStateChange(this.getOnlineState());
			return;
		}

		// Update the game time
		this._secondsPlayed += deltaTick / 1000;

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
			this._gameStateHandlers.onScoreUpdated(this.player1.score, this.player2.score);

			// If this state machine is acting as the host, send the new state to the listening clients
			if (this._isHost)
				this._gameStateHandlers.onImportantStateChange(this.getOnlineState());
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

			// Play a beeping sound
			this._gameStateHandlers.onBoopSound();

			// If this state machine is acting as the host, send the new state to the listening clients
			if (this._isHost)
				this._gameStateHandlers.onImportantStateChange(this.getOnlineState());
		}

		// Update positions
		this.ball.move();
		this.player1.paddle.move();
		this.player2.paddle.move();
	}

	/**
	 * Handle an incoming state update from the host.
	 * Only call this in online multiplayer mode.
	 * @param state The game state to apply.
	 */
	public handleOnlineState = (state: OnlineGameState) => {
		if (this._gameMode != ONLINE_MULTIPL_MODE_ID) {
			throw Error("Refusing to handle a state change; game is not in online multiplayer mode!");
		}

		// TODO: handle timestamp

		// Debug
		console.log(`Left player name locally before state change: ${this.player1.name}`);
		console.log(`Right player name locally before state change: ${this.player2.name}`);

		// Update the ball position
		this.ball.pos.x = state.ball.pos.x;
		this.ball.pos.y = state.ball.pos.y;

		// Match left and right with the correct player
		const playerLeft = (state.players.left.paddle.position == "right" ? this.player1 : this.player2);
		const playerRight = (state.players.right.paddle.position == "left" ? this.player2 : this.player1);

		const updatePlayerState = (player: Player, onlinePlayerState: OnlinePlayerState) => {
			player.avatar = onlinePlayerState.avatar;
			player.name = onlinePlayerState.name;
			player.paddle.pos.x = onlinePlayerState.paddle.pos.x;
			player.paddle.pos.y = onlinePlayerState.paddle.pos.y;
			player.paddle.size.w = onlinePlayerState.paddle.size.w;
			player.paddle.setHeight(onlinePlayerState.paddle.size.h);
			player.score = onlinePlayerState.score;
			console.log("Updated player state: ", player, onlinePlayerState);
			console.log(`Player ${player.name} is ready locally? `, player.isReady());
			console.log(`Player ${player.name} is ready remote? `, onlinePlayerState.ready);
			if (!player.isReady() && onlinePlayerState.ready) {
				console.log(`Player ${player.name} is ready!`);
				player.markReady();
			}
		}

		// Update the "left" player
		updatePlayerState(playerLeft, state.players.left);

		// Update the "right" player
		updatePlayerState(playerRight, state.players.right);

		// Update the paused state
		// @ts-ignore no typescript, fuck you
		if (state.paused && state.paused.id != PausedReason.WAITING_FOR_OPPONENT.id)
			this._paused = state.paused;

		// Check if both players are ready and start the game if it hasn't yet
		console.log(this._paused);
		console.log(playerLeft.isReady(), playerRight.isReady());
		console.log(this.player1.isReady(), this.player2.isReady());
		if (this._paused == PausedReason.WAITING_FOR_OPPONENT && this.player1.isReady() && this.player2.isReady()) {
			this.startGame();
		}

		// Update the time
		this._secondsPlayed = state.time.secondsPlayed;
		this._gameDuration = state.time.gameDuration;

		console.log(`Left player name locally after state change: ${this.player1.name}`);
		console.log(`Right player name locally after state change: ${this.player2.name}`);
	}

	//= Public =//

	/**
	 * Get the current game state used for online multiplayer.
	 * @returns The full current game state.
	 */
	public getOnlineState = (): OnlineGameState => {
		return {
			time: {
				timestamp: Date.now(),
				secondsPlayed: this._secondsPlayed,
				gameDuration: this._gameDuration
			},
			paused: this._paused,
			players: {
				left: this.player1.getOnlineState(),
				right: this.player2.getOnlineState()
			},
			ball: {
				pos: this.ball.pos,
				size: this.ball.size,
				dx: this.ball.dx,
				dy: this.ball.dy,
				speed: this.ball.speed
			}
		};
	}

	/**
	 * Get the game mode of the current game.
	 * @returns The current game mode.
	 */
	public getGameMode = () => {
		return this._gameMode;
	}

	/**
	 * Start the game: mark player 1 as ready.
	 * Note: in local multiplayer, it marks both players as ready and starts the game.
	 */
	public startGame = () => {
		console.log("Starting game?");
		console.log(this.getPausedReason());
		if (this.getPausedReason() == PausedReason.READY_SET_GO || this.getPausedReason() == PausedReason.WAITING_FOR_OPPONENT) {
			this.player1.markReady();

			// If we're in local multiplayer, mark player 2 as ready as well
			if (this.getGameMode() == LOCAL_MULTIPL_MODE_ID) {
				this.player2.markReady();
			}

			// Check if player 2 is ready
			// Always perform this check: in singleplayer, the AI needs to be ready too!
			if (!this.player2.isReady()) {
				console.log("Still waiting for opponent", this.player1.isReady(), this.player2.isReady());
				this._paused = PausedReason.WAITING_FOR_OPPONENT;
			}
			else {
				console.log("Started game");
				this._paused = null;
			}

			// If this state machine is acting as the host, send the new state to the listening clients
			if (this._isHost)
				this._gameStateHandlers.onImportantStateChange(this.getOnlineState());
		}
	}

	/**
	 * Pause the game.
	 * @param reason The reason for the pause. See PausedReason for more info.
	 * @returns True if the game is now paused, false if it was already paused.
	 */
	public pauseGame = (reason: PausedReasonObject): boolean => {
		if (this._paused)
			return false;

		if (!PausedReason.isValidReason(reason))
			throw new Error("Invalid pause reason: " + reason);
		this._paused = reason;
		return true;
	}

	/**
	 * Unpause the game.
	 * @returns True if the game was unpaused, false if remains paused.
	 */
	public unPauseGame = (): boolean => {
		if (this._paused) {
			this._paused = null;
			return true;
		}
		return false;
	}

	/**
	 * Check if the game is paused.
	 * @returns True if the game is paused, false if it is not.
	 */
	public isPaused = (): boolean => {
		return this._paused != null;
	}

	/**
	 * Get the reason for the game being paused.
	 * @returns The reason (see PausedReason for more info). NULL if the game is not paused.
	 */
	public getPausedReason = (): PausedReasonObject | null => {
		return this._paused;
	}

	/**
	 * Get the amount of time played in the current game.
	 * @returns The current game time in seconds.
	 */
	public getTimePlayed = (): number => {
		return this._secondsPlayed;
	}

	/**
	 * Get the current game's duration.
	 * @returns The current game's duration in seconds.
	 */
	public getGameDuration = (): number => {
		return this._gameDuration;
	}
}

export default GameStateMachine;

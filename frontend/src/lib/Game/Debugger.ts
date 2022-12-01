import type GameStateMachine from "./StateMachine";
import type GameAI from "./AI";
import type GameRenderer from "./Renderer";
import type GameController from "./Controller";
import type GameNetworkHandler from "./NetworkHandler";
import type GameSoundEngine from "./SoundEngine";
import type { Dimensions, Player } from "./StateMachine";

class GameDebugger {
	private _gameAI: GameAI | undefined;
	private _gameController: GameController | undefined;
	private _networkHandler: GameNetworkHandler | undefined;
	private _renderer: GameRenderer | undefined;
	private _soundEngine: GameSoundEngine | undefined;
	private _gameState: GameStateMachine;

	constructor(gameAI: GameAI | undefined, gameController: GameController | undefined, networkHandler: GameNetworkHandler | undefined, renderer: GameRenderer | undefined, soundEngine: GameSoundEngine | undefined, gameState: GameStateMachine) {
		this._gameAI = gameAI;
		this._gameController = gameController;
		this._networkHandler = networkHandler;
		this._renderer = renderer;
		this._soundEngine = soundEngine;
		this._gameState = gameState;
	}

	private _renderPlayerInfo = (pNum: number, ctx: CanvasRenderingContext2D, player: Player, canvasSize: Dimensions): void => {
		ctx.save();
		ctx.fillStyle = "#fff";
		ctx.font = "15px monospace";
		ctx.textAlign = player.paddle.getPosition();
		const x = player.paddle.getPosition() === "left" ? 30 : canvasSize.w - 30;
		const lines = 9;
		const y = [];
		for (let i = 0; i < lines; i++) {
			y[i] = canvasSize.h - (lines - 1) * 20 + i * 20 - 10;
		}

		const p1Pos = [player.paddle.pos.x.toFixed(2), player.paddle.pos.y.toFixed(2)];
		ctx.fillText(`PLAYER ${pNum}: ${player.intraName}`, x, y[0]);
		ctx.fillText(`Paddle: dy ${player.paddle.getMoveDirection().toFixed(2)}; pos ${p1Pos.join(", ")}; maxMove: ${player.paddle.getMaxMoveSpeed().toFixed(2)}`, x, y[1]);
		ctx.fillText(`Score: ${player.score}`, x, y[2]);
		ctx.fillText(`Avatar: ${player.avatar}`, x, y[3]);

		if (this._gameAI) {
			const aiState = this._gameAI?.getState();
			if (aiState.paddle == player.paddle.getPosition()) {
				ctx.fillText(`AI followBall: ${aiState.followBall}`, x, y[4]);
				ctx.fillText(`AI randomDirection: ${aiState.randomDirection.toFixed(2)}`, x, y[5]);
				ctx.fillText(`AI lastChange: ${aiState.lastRandomDirectionChange}`, x, y[6]);
				ctx.fillText(`AI lastChangeAgo: ${(Date.now() - aiState.lastRandomDirectionChange).toPrecision(6)}ms`, x, y[7]);
				ctx.fillText(`AI rethinkEvery: ${aiState.rethinkEvery}ms`, x, y[8]);
			}
		}

		ctx.restore();
	}

	public setRenderer = (renderer: GameRenderer): void => {
		this._renderer = renderer;
	}

	public render = (ctx: CanvasRenderingContext2D, fps: number): void => {
		if (!this._renderer)
			return;

		ctx.save();
		ctx.fillStyle = "#fff";
		ctx.font = "15px monospace";
		ctx.textAlign = "left";

		// Desired TPS
		const tps = this._gameState.getTps();
		ctx.fillText(`Desired TPS: ${tps[0].toFixed(2)}`, 30, 20);

		// Actual TPS
		if (tps[1] < 0.75 * tps[0])
			ctx.fillStyle = "#f00"; // Make text red if we're lagging
		ctx.fillText(`Current TPS: ${tps[1].toFixed(2)}`, 30, 40);
		ctx.fillStyle = "#fff";

		// FPS
		if (fps < tps[0] * 0.9)
			ctx.fillStyle = "#ffa500"; // Make text orange if fps is significantly lower than tps
		ctx.fillText(`Current FPS: ${fps.toFixed(2)}`, 30, 60);
		ctx.fillStyle = "#fff";

		// Network response time
		if (this._networkHandler) {
			const respTime = this._networkHandler?.getResponseTime();
			if (respTime > 100)
				ctx.fillStyle = "#f00"; // Make text red if response time is way too high
			else if (respTime > 50)
				ctx.fillStyle = "#ffa500"; // Make text orange if response time is too high
			else if (respTime > 25)
				ctx.fillStyle = "#ff0"; // Make text yellow if response time is a little too high
			ctx.fillText(`NTW latency: ${respTime.toFixed(0)}ms`, 30, 80);
			ctx.fillStyle = "#fff";
		}
		else
			ctx.fillText("Network RTM: N/A", 30, 80);

		// Canvas info
		const canvasSize = this._renderer?.getSize();
		ctx.fillText(`Canvas size: ${Object.values(canvasSize).join("x")}`, 30, 100);

		// Game time
		ctx.fillText(`Gametime TM: ${this._gameState.getTimePlayed().toFixed(4)}s / ${this._gameState.getGameDuration().toFixed(0)}s`, 30, 120);

		// Current client time
		ctx.fillText(`Current  TM: ${Date.now()}`, 30, 140);

		// Ball info
		const ballPos = [this._gameState.ball.pos.x.toFixed(2), this._gameState.ball.pos.y.toFixed(2)];
		ctx.fillText(`Ball status: dx ${this._gameState.ball.dx.toFixed(2)}; dy ${this._gameState.ball.dy.toFixed(2)}; pos ${ballPos.join(", ")}`, 30, 160);

		// Paused info
		ctx.fillText(`Paused: ${this._gameState.isPaused()} ${(this._gameState.isPaused() ? `(${this._gameState.getPausedReason()?.id}: ${this._gameState.getPausedReason()?.reason})` : '')}`, 30, 180);

		ctx.restore();

		// Player info
		this._renderPlayerInfo(1, ctx, this._gameState.player1, canvasSize);
		this._renderPlayerInfo(2, ctx, this._gameState.player2, canvasSize);
	}
}

export default GameDebugger;

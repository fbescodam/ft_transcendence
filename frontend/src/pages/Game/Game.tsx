/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Game.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/10/06 16:15:50 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Game.css";
import { Vector } from "vecti";
import Layout from "../../containers/Layout";
import Container from "../../components/Container";
import ScoreDisplay from "../../components/ScoreDisplay";
import React, { useEffect, useRef, useState } from "react";
import Logger from "../../utils/Logger";
import { GameProvider } from "../../utils/GameContext";

////////////////////////////////////////////////////////////////////////////////

/**
 * A base class for drawable 2d objects.
 */
abstract class Object {
	pos: Vector;
	width: number;
	height: number;

	constructor(pos: Vector, width: number, height: number) {
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
	constructor(pos: Vector, width: number, height: number) {
		super(pos, width, height);
	}

	//= Public =//

	public move(vec: Vector) {
		this.pos = this.pos.add(vec);
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
	constructor(pos: Vector, width: number, height: number) {
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

/**
 * Handles the state of the game such as rendering, input control, ...
 *
 * @Note For now this will be all done on frontend, later this merley serves for
 * smoothing out stuff. Server will overwrite everything.
 */
class GameStateMachine {

	scoreP1: number;
	scoreP2: number;

	paddleP1: Paddle; // Left
	paddleP2: Paddle; // Right
	ball: Ball;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	// TODO: Implement custom vector instead
	dx: number;
	dy: number;

	constructor(canvas: HTMLCanvasElement) {


		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;

		this.scoreP1 = 0;
		this.scoreP2 = 0;

		this.ball = new Ball(new Vector(this.canvas.width / 2, this.canvas.height / 2), 16, 16);
		this.paddleP1 = new Paddle(new Vector(10, 100), 10, 100);
		this.paddleP2 = new Paddle(new Vector(1000, 600), 10, 100);

		const speed = 8;
		this.dx = Math.random() > 0.5 ? -speed : speed;
		this.dy = Math.random() > 0.5 ? -speed : speed;
	}
	
	// TODO: Refactor!
	public animate = () => {
		requestAnimationFrame(this.animate);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		const p2Win = this.ball.pos.x < 0;
		const p1Win = this.ball.pos.x > this.canvas.width;

		if (p1Win || p2Win) {
			this.ball.pos = new Vector(this.canvas.width / 2, this.canvas.height / 2);
			this.dx = Math.random() > 0.5 ? -8 : 8;
			this.dy = Math.random() > 0.5 ? -8 : 8;

			if (p1Win)
				this.scoreP1++;
			else
				this.scoreP2++;
		}
		// Check baddle intersection
		else if (Object.intersects(this.ball, this.paddleP1) || 
			Object.intersects(this.ball, this.paddleP2)) {
			this.dx *= -1;
		}
		// Y-Up || Y-Down
		else if (this.ball.pos.y + this.dy > this.canvas.height - this.ball.height || 
			this.ball.pos.y + this.dy < 0) {
			this.dy *= -1;
		}

		this.ball.move(new Vector(this.dx, this.dy));

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

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const GamePage = () => {
	const [score, setScore] = useState([0, 0]);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Init
	useEffect(() => {
		if (canvasRef.current == null)
			return Logger.error("Failed to get canvas reference!");

		canvasRef.current.addEventListener('keydown', (event) => {
			console.log(event.key);
		});

		const gameState = new GameStateMachine(canvasRef.current);
		if (gameState == null)
			return Logger.error("Failed to create a gamestate!");
		gameState.animate();
	}, []);

	return (
		<Layout>
			<Container>
				<h1>Game Page</h1>
			</Container>
			<div className="display-center">
				<Container>
					<ScoreDisplay />
					<canvas ref={canvasRef} id="game-canvas" width="1080" height="720"/>
				</Container>
			</div>
		</Layout>
	);
};

export default GamePage;

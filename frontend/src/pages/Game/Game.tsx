/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Game.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/30 18:04:23 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Game.css";
import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/Container";
import Layout from "../../containers/Layout";
import ScoreDisplay from "../../components/ScoreDisplay";
import { Vector } from "vecti";

////////////////////////////////////////////////////////////////////////////////

/**
 * A base class for drawable 2d objects.
 */
abstract class Object {
	pos: Vector;

	constructor(pos: Vector) {
		this.pos = pos;
	}

	/**
	 * Renders the given object onto a context.
	 * @param ctx The canvas rendering context object.
	 */
	abstract render(ctx: CanvasRenderingContext2D): void;

	/**
	 * Checks wether or not the given position intersects with the object.
	 * @param pos The given position to check if it intersects.
	 * @returns True if the point intersects with the object, else false.
	 */
	abstract intersects(pos: Vector): boolean;
}

////////////////////////////////////////////////////////////////////////////////

class Ball extends Object {
	radius: number;

	constructor(pos: Vector, radius: number) {
		super(pos);
		this.pos = pos;
		this.radius = radius;
	}

	//= Public =//

	public override render(ctx: CanvasRenderingContext2D) {
		ctx.save();
		ctx.beginPath();
		{
			ctx.fillStyle = "#fff";
			ctx.arc(this.pos.x, this.pos.y, this.radius, Math.PI * 2, 0);
			ctx.stroke();
			ctx.fill();
		}
		ctx.closePath();
		ctx.restore();
	}

	public override intersects(pos: Vector): boolean {
		return (
			(pos.x - this.pos.x) * (pos.x - this.pos.x) +
				(pos.y - this.pos.y) * (pos.y - this.pos.y) <=
			this.radius * this.radius
		);
	}
}

////////////////////////////////////////////////////////////////////////////////

class Paddle extends Object {
	width: number;
	height: number;

	constructor(pos: Vector, width: number, height: number) {
		super(pos);
		this.pos = pos;
		this.width = width;
		this.height = height;
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

	// eturn isInsideRectangle(x, y, this.data.x, this.data.y, this.width, this.height);
	public override intersects(pos: Vector): boolean {
		const x1 = this.pos.x - this.width / 2;
		const y1 = this.pos.y - this.height / 2;

		if (
			pos.x < x1 ||
			pos.y < y1 ||
			pos.x > x1 + this.width ||
			pos.y > y1 + this.height
		)
			return false;
		return true;
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

	paddleP1: Paddle;
	paddleP2: Paddle;
	ball: Ball;

	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const ctx = canvas.getContext("2d");
		if (!ctx) { throw new Error("No context!") }

		this.ctx = ctx;

		this.scoreP1 = 0;
		this.scoreP2 = 0;

		this.ball = new Ball( new Vector(this.canvas.width / 2, this.canvas.height / 2), 18);
		this.paddleP1 = new Paddle(new Vector(10, 100), 10, 100);
		this.paddleP2 = new Paddle(new Vector(1000, 100), 10, 100);
	}

	public render() {

		if (!this.ctx)
			return console.error("No context!");

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ball.render(this.ctx);
		this.paddleP1.render(this.ctx);
		this.paddleP2.render(this.ctx);

		let dx = 2;
		let dy = -2;

		if(this.ball.pos.x + dx > this.canvas.width - this.ball.radius || this.ball.pos.x + dx < this.ball.radius) {
            dx = -dx;
        }
        if(this.ball.pos.y + dy > this.canvas.height - this.ball.radius || this.ball.pos.y + dy < this.ball.radius) {
            dy = -dy;
        }

        this.ball.pos.add(new Vector(dx, dy));
	}
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
const GamePage = () => {
	const [gameState, setGameState] = useState<GameStateMachine>();
	const canvasRef = useRef<HTMLCanvasElement>(null);
	
	// Init
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null) return console.error("Canvas is null");

		console.log(`Canvas size: ${canvas.width}, ${canvas.height}`);
		const render = new GameStateMachine(canvasRef.current!);
		setGameState(render);
		render.render();
		requestAnimationFrame(render.render);
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

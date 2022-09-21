/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   GameState.ts                                       :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 17:54:36 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/21 20:31:19 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import { Vector } from 'vecti'
import Logger from "../../utils/Logger";

/**
 * The game state manages and renders the received data from the backend
 * and renders it to the canvas.
 */
class GameState {

	p1Score: number;
	p2Score: number;
	p1Position: Vector;
	p2Position: Vector;
	ballPosition: Vector;
	
    ctx: CanvasRenderingContext2D;

	// TODO: Maybe fetch from backend the starting pos ?
    constructor(canvas: HTMLCanvasElement) {
		this.p1Score = 0;
		this.p2Score = 0;
		this.p1Position = new Vector(0, 0);
		this.p2Position = new Vector(0, 0);
		this.ballPosition = new Vector(0, 0);
		
        this.ctx = canvas.getContext("2d")!;
    }

	public update() {
		requestAnimationFrame(this.update);

		// Player paddles
		this.ctx.fillRect(this.p1Position.x, this.p1Position.y, 32, 128);
		this.ctx.fillRect(this.p2Position.x, this.p2Position.y, 32, 128);

		// Ball
		this.ctx.arc(this.ballPosition.x, this.ballPosition.y, 32, 0, Math.PI * 2);
	}

}

export {}
/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   GameState.ts                                       :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/08 17:54:36 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/19 11:25:14 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import Logger from "../../utils/Logger";

class GameState {

    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d")!;
    }

    ///

    public update() {
        
    }
}

export {}
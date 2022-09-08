/* ************************************************************************** */
/*                                                                            */
/*                                                        ::::::::            */
/*   Game.tsx                                           :+:    :+:            */
/*                                                     +:+                    */
/*   By: lde-la-h <lde-la-h@student.codam.nl>         +#+                     */
/*                                                   +#+                      */
/*   Created: 2022/09/05 19:11:25 by lde-la-h      #+#    #+#                 */
/*   Updated: 2022/09/08 17:17:16 by lde-la-h      ########   odam.nl         */
/*                                                                            */
/* ************************************************************************** */

import "./Game.css"
import React, { useEffect, useRef, useState } from 'react';
import Container from "../../components/Container";

////////////////////////////////////////////////////////////////////////////////

/**
 * A button with a text value, a callback and possibly an icon.
 */
 const GamePage = () => {

	const gameState = useState();
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Initiliaztion effect
	useEffect(() => {
		
	},[]);

	return (
		<>
			<h1>Game Page</h1>
			<div className="display-center ">
				<canvas ref={canvasRef} id="game-canvas" width={1080} height={720}/>
			</div>
		</>
	);
};

export default GamePage;
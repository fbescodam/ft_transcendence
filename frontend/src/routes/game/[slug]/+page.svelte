<!-- Scripting -->

<script lang="ts">
import { onMount } from "svelte";
import type { Vec2 } from "$lib/Types";
import GameStateMachine from "$lib/GameState";
import Container from "$lib/Components/Container/Container.svelte";

let canvas: HTMLCanvasElement;
let gameState: GameStateMachine;
let score: Vec2 = { x: 0, y: 0 };

onMount(() => {
	gameState = new GameStateMachine(canvas);

	const animate = () => {
		gameState.animate();
		score = gameState.score;
		
		
		requestAnimationFrame(animate);
	};

	// TODO: Display a countdown to indicate when match is starting.
	setTimeout(() => {
		animate();
	}, 3000);
});

const keyDownHandler = (event: KeyboardEvent) => {
	console.log(event.code);
	
	if (event.code === "KeyW")
		gameState.paddleP1.pos = { x: gameState.paddleP1.pos.x, y: gameState.paddleP1.pos.y - 45 };
	if (event.code === "KeyS")
		gameState.paddleP1.pos = { x: gameState.paddleP1.pos.x, y: gameState.paddleP1.pos.y + 45 };
	if (event.code === "ArrowUp")
		gameState.paddleP2.pos = { x: gameState.paddleP2.pos.x, y: gameState.paddleP2.pos.y - 45 };
	if (event.code === "ArrowDown")
		gameState.paddleP2.pos = { x: gameState.paddleP2.pos.x, y: gameState.paddleP2.pos.y + 45 };
};

</script>

<!-- HTML -->

<svelte:head>
	<title>Game</title>
	<meta name="description" content="Play a nice game of Pong!" />
</svelte:head>

<div class="center">
	<Container>
		<Container>
			<div class="score">
				<img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512" alt="P1"/>
				<b>{score.x} : {score.y}</b>
				<img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512" alt="P2"/>
			</div>
		</Container>
		<canvas bind:this={canvas} width="1080" height="720" tabindex="0" on:keyup={keyDownHandler}/>
	</Container>
</div>

<!-- Styling -->

<style lang="scss">

canvas {
	margin-top: 8px;

	border-radius: 8px;
	outline: none;
	border: 1px var(--component-border) solid;
}

.center {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.score {
	display: flex;
	align-items: center;
	overflow: hidden;
	justify-content: space-between;

	& b {
		font-size: x-large;
	}

	& img {
		border-radius: 8px;
	}
}
</style>

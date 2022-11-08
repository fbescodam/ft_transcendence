<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
	import { onMount } from "svelte";
	import GameStateMachine from "./GameState";
	import Container from "$lib/Components/Container/Container.svelte";

	$: score = { x: 0, y: 0 };
	let canvas: HTMLCanvasElement;
	let gameState: GameStateMachine;

	onMount(() => {
		gameState = new GameStateMachine(canvas, score)
		
		const animate = () => {
			gameState.animate();
			score = gameState.score;

			requestAnimationFrame(animate);
		}

		animate();
	});

	const keyDownHandler = (event: KeyboardEvent) => {
	
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

<!-- Styles -->

<style lang="scss">
	.score-display {
		color: white;
		font-weight: bold;
		font-size: 32px;
		font-family: 'Courier New', Courier, monospace;
	}

	.score-panel {
		display: flex;
		align-items: center;
		overflow: hidden;
		justify-content: space-between;
	}

</style>

<!-- HTML -->

<svelte:head>
	<title>Game</title>
	<meta name="description" content="Play a nice game of Pong!" />
</svelte:head>

<h1>Games Page</h1>

<Container>
	<Container>
		<div class="score-panel">
			<img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512" alt="P1"/>
			<div class="score-display">
				<span id="p1-score">{score.x}</span>
				<span>:</span>
				<span id="p2-score">{score.y}</span>
			</div>
			<img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512" alt="P2"/>
		</div>
	</Container>
	<canvas bind:this={canvas} id="game-canvas" tabindex="0" width="1080" height="720" on:keydown={keyDownHandler}/>
</Container>
<!-- Scripting -->

<script lang="ts">
import { onMount, onDestroy } from "svelte";
import GameTicker from "$lib/GameTicker";
import GameStateMachine from "$lib/GameState";
import GameRenderer from "$lib/GameRenderer";
import GameController from "$lib/GameController";
import Container from "$lib/Components/Container/Container.svelte";
import { LOCAL_MULTIPL_MODE_ID } from "$lib/Modes";

let canvas: HTMLCanvasElement;
let gameTicker: GameTicker;
let gameController: GameController;
let gameRenderer: GameRenderer;
let gameState: GameStateMachine;
let scores: HTMLElement;

onMount(() => {
	console.log("onMount called");
	gameTicker = new GameTicker();
	gameState = new GameStateMachine(gameTicker, canvas.width, canvas.height, LOCAL_MULTIPL_MODE_ID);
	gameController = new GameController(gameTicker, gameState);
	gameRenderer = new GameRenderer(canvas, gameState, scores);
});

onDestroy(() => {
	console.log("onDestroy called");
	window.location.reload();
	// TODO: Leon pls fix (gameState, gameController and gameRenderer should be reset)
});

const keyUpHandler = (event: KeyboardEvent) => {
	gameController.setKeyNotPressed(event.key);
};

const keyDownHandler = (event: KeyboardEvent) => {
	// console.log(event);
	gameController.setKeyPressed(event.key);

	if (event.code === "Escape")
		gameController.togglePause();
};

</script>

<!-- HTML -->

<svelte:head>
	<title>Game</title>
	<meta name="description" content="Play a nice game of Pong!" />
	<link href="https://fonts.cdnfonts.com/css/common-pixel" rel="stylesheet">
</svelte:head>

<svelte:window on:keyup={keyUpHandler} on:keydown={keyDownHandler} />

<div class="center">
	<Container>
		<Container>
			<div class="score">
				<img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512" alt="P1"/>
				<b bind:this={scores} >0 : 0</b>
				<img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512" alt="P2"/>
			</div>
		</Container>
		<canvas bind:this={canvas} width="1080" height="720" tabindex="0" />
	</Container>
</div>

<!-- Styling -->

<style lang="scss">

canvas {
	display: block;
	margin-top: 1rem;

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
	font-family: 'Common Pixel', sans-serif;

	& b {
		font-size: xx-large;
	}

	& img {
		border-radius: 8px;
	}
}
</style>

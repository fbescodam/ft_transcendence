<!-- Scripting -->

<script lang="ts">
import { onMount, onDestroy } from "svelte";
import { page } from '$app/stores';
import { goto } from "$app/navigation";
import GameTicker from "$lib/Game/Ticker";
import GameStateMachine from "$lib/Game/StateMachine";
import GameRenderer from "$lib/Game/Renderer";
import GameController from "$lib/Game/Controller";
import type { GameMode } from "$lib/Game/Modes";
import GameAI from "$lib/Game/AI";
import Container from "$lib/Components/Container/Container.svelte";
import { LOCAL_MULTIPL_MODE_ID, ONLINE_MULTIPL_MODE_ID, SINGLEPL_MODE_ID } from "$lib/Game/Modes";
import type { User, Dimensions } from "$lib/Types";
import { JWT, displayName, avatar } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { initSocket } from "$lib/socketIO";

let canvas: HTMLCanvasElement;
let scores: HTMLElement;
let timer: HTMLElement;
let avatar1: HTMLImageElement;
let avatar2: HTMLImageElement;

let gameTicker: GameTicker;
let gameController: GameController;
let gameRenderer: GameRenderer;
let gameState: GameStateMachine;
let gameAI: GameAI;
let io: Socket;

async function getGameData(gameId: number) {
	console.log("Fetching game data...");
	return new Promise((resolve, reject) => {
		if (!io)
			return reject("Socket not initialized");
		io.emit("getGame", { game: { id: gameId } }, (ret: any) => {
			console.log("Game data fetched:", ret);
			if ("error" in ret)
				return reject(ret.error);
			if (!("game" in ret))
				return reject("game key missing in getGame response");
			resolve(ret.game);
		});
	});
}

function populateUser(user: User, gameUserData: any) {
	user.id = gameUserData.id;
	user.intraId = gameUserData.intraId;
	user.intraName = gameUserData.intraName;
	user.name = gameUserData.name;
	user.avatar = `${$page.url.protocol}//${$page.url.hostname}:3000/${gameUserData.avatar}`;
}

async function initGame() {
	const gameId: number = parseInt($page.params.slug);
	let gameMode: GameMode = ONLINE_MULTIPL_MODE_ID;
	if (isNaN(gameId)) {
		switch ($page.params.slug) {
			case "singleplayer":
				gameMode = SINGLEPL_MODE_ID;
				break;
			case "local-multiplayer":
				gameMode = LOCAL_MULTIPL_MODE_ID;
				break;
			default:
				console.warn("Invalid game slug", $page.params.slug);
				return goto("/game", { replaceState: true });
		}
	}

	let player1: User = {
		id: 999999999999,
		intraName: "TODO", // TODO: replace with IntraName
		name: ($displayName ? $displayName : "Player 1"),
		avatar: ($avatar ? `${$page.url.protocol}//${$page.url.hostname}:3000/${$avatar}` : ""),
		games: []
	};
	let player2: User = {
		id: 999999999999,
		intraName: "player2",
		name: "Player 2",
		avatar: "https://picsum.photos/200",
		games: []
	};

	if (gameMode == ONLINE_MULTIPL_MODE_ID) {
		io = initSocket($JWT!);
		const gameData: any = await getGameData(gameId);
		if (gameData.players.length != 2)
			throw new Error("Invalid number of players in game");
		if (gameData.players[0].name == $displayName) {
			populateUser(player1, gameData.players[0]);
			populateUser(player2, gameData.players[1]);
		}
		else {
			populateUser(player1, gameData.players[1]);
			populateUser(player2, gameData.players[0]);
		}
	}

	gameTicker = new GameTicker();
	const gameSize: Dimensions = { w: canvas.width, h: canvas.height };
	gameState = new GameStateMachine(gameTicker, gameSize, gameMode, player1, player2);
	gameController = new GameController(gameTicker, gameState);
	gameRenderer = new GameRenderer(canvas, gameState, scores, timer, avatar1, avatar2);

	if (gameMode === SINGLEPL_MODE_ID) {
		gameAI = new GameAI(gameTicker, gameState, gameState.player2);
	}
}

onMount(() => {
	console.log("onMount called");
	initGame();
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
	if (event.code === "Space")
		gameController.amReady();
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
				<img bind:this={avatar1} width={64} height={64} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="P1"/>
				<div class="score-middle">
					<b bind:this={scores} >0 : 0</b>
					<i bind:this={timer} >3:00</i>
				</div>
				<img bind:this={avatar2} width={64} height={64} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="P2"/>
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
	max-width: 100%;

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
	text-align: center;
	overflow: hidden;
	justify-content: space-between;
	font-family: 'Common Pixel', sans-serif;

	& b {
		display: block;
		font-size: xx-large;
	}

	& i {
		display: block;
		color: var(--secondary-color);
		margin-top: 0.2em;
	}

	& img {
		border-radius: 8px;
	}
}
</style>

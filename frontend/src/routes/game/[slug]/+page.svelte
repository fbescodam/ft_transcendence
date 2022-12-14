<!-- Scripting -->

<script lang="ts">
import { onMount, onDestroy } from "svelte";
import { page } from '$app/stores';
import { goto } from "$app/navigation";
import GameTicker from "$lib/Game/Ticker";
import GameStateMachine, { PausedReason, Player, type Dimensions } from "$lib/Game/StateMachine";
import GameRenderer from "$lib/Game/Renderer";
import GameController from "$lib/Game/Controller";
import GameSoundEngine from "$lib/Game/SoundEngine";
import GameDebugger from "$lib/Game/Debugger";
import type { GameMode } from "$lib/Game/Modes";
import GameAI from "$lib/Game/AI";
import Container from "$lib/Components/Container/Container.svelte";
import { LOCAL_MULTIPL_MODE_ID, ONLINE_MULTIPL_MODE_ID, SINGLEPL_MODE_ID } from "$lib/Game/Modes";
import type { User } from "$lib/Types";
import { JWT, displayName, avatar, intraName } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { initSocket, destroySocket } from "$lib/socketIO";
// @ts-ignore ignore "cannot find module" error below, it is probably a bug in the IDE? It compiles...
import { createPlaceholderUser } from "$lib/Utils/Placeholders";
import type { OnlineGameState, OnlinePaddleState } from "$lib/Game/NetworkTypes";
import GameNetworkHandler from "$lib/Game/NetworkHandler";

let canvas: HTMLCanvasElement;
let scores: HTMLElement;
let timer: HTMLElement;
let playerLeft: HTMLElement;
let playerRight: HTMLElement;

let gameSoundEngine: GameSoundEngine = new GameSoundEngine($page.url.hostname);
let gameTicker: GameTicker;
let gameController: GameController;
let gameRenderer: GameRenderer;
let gameState: GameStateMachine;
let gameNetworkHandler: GameNetworkHandler;
let gameAI: GameAI;
let gameDebugger: GameDebugger;
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
			if (!("game" in ret) || !ret["game"])
				return reject("game key missing in getGame response");
			if (ret.game.status == "ENDED")
				return reject("Game already ended");
			resolve(ret.game);
		});
	});
}

function populateUser(user: User, gameUserData: any) {
	user.id = gameUserData.id;
	user.intraName = gameUserData.intraName;
	user.name = gameUserData.name;
	user.avatar = `${$page.url.protocol}//${$page.url.hostname}:3000/${gameUserData.avatar}`;
}

async function initGame() {
	// Retrieve the game mode
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

	// Populate user data and initialize multiplayer socket if required
	const player1: User = createPlaceholderUser(($intraName ? $intraName : "player1"), ($displayName ? $displayName : "Player 1"), ($avatar ? $avatar : null), $page.url);
	const player2: User = createPlaceholderUser("player2", "Player 2", null, $page.url);
	if (gameMode == ONLINE_MULTIPL_MODE_ID) {
		io = initSocket($page.url.hostname, $JWT!);
		try {
			const gameData: any = await getGameData(gameId);
			if (gameData.players.length != 2)
				throw new Error("Invalid number of players in game");
			populateUser(player1, gameData.players[0]);
			populateUser(player2, gameData.players[1]);
		}
		catch (e) {
			console.error("Failed to setup game:", e);
			alert("Failed to setup game: " + e);
			return goto("/game", { replaceState: true });
		}
	}


	// Set up the game engine
	gameTicker = new GameTicker();
	const gameSize: Dimensions = { w: canvas.width, h: canvas.height };
	gameState = new GameStateMachine(gameId, gameTicker, gameSize, gameMode, {p1: player1, p2: player2}, {
		onScoreUpdated: (p1Score: number, p2Score: number) => {
			scores.innerText = `${p1Score} : ${p2Score}`;
		},
		onBeepSound: () => {
			gameSoundEngine.playBeep();
		},
		onBoopSound: () => {
			gameSoundEngine.playBoop();
		},
		onGameStart: () => {
			gameSoundEngine.playTheme("game");
		},
		onImportantStateChange: (state: OnlineGameState) => {
			// If the game is paused, but only for truly a pause, pause the currently playing theme
			if (state.paused != null && (state.paused == PausedReason.PAUSED_P1 || state.paused == PausedReason.PAUSED_P2 || state.paused == PausedReason.PAUSED_BY_SERVER))
				gameSoundEngine.pauseTheme();

			if (!state.paused) {
				// Make sure the game theme is playing when the game is not paused
				const theme = gameSoundEngine.getTheme();
				if (!theme || theme.indexOf("game-theme.mp3") == -1)
					gameSoundEngine.playTheme("game");
				if (gameSoundEngine.themeIsPaused())
					gameSoundEngine.resumeTheme();

				// Sync the game theme with the game time (may have a difference of half a second)
				// Only if the game is ongoing
				const themeTime: number = gameSoundEngine.getThemeTime();
				if (themeTime < state.time.secondsPlayed - 0.25 || themeTime > state.time.secondsPlayed + 0.25)
					gameSoundEngine.setThemeTime(state.time.secondsPlayed);
			}
		},
		onPaddleMoveChange: (paddleState: OnlinePaddleState) => {
			if (gameNetworkHandler)
				gameNetworkHandler.sendPaddleState(paddleState);
		},
		onPlayerReady: async (player: Player) => {
			console.log("Player ready callback called", gameNetworkHandler);
			while (!gameNetworkHandler) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
			gameNetworkHandler.sendPlayerReady(player.intraName);
		},
		onGameOver: (state: OnlineGameState) => {
			console.log("The game is over! Final state:", state);
			(async () => {
				// Wait a bit before playing the game over sound
				// This is to avoid the sound being played before the game theme is over - it is about 1 second too long!
				await new Promise(resolve => setTimeout(resolve, 1000));
				gameSoundEngine.stopTheme();
				if (gameMode != LOCAL_MULTIPL_MODE_ID) {
					const mainUser = gameController.getMainUser();
					const otherUser = gameController.getOtherUser();
					if (!mainUser || !otherUser)
						return;
					const finalScoreMain = mainUser.score - otherUser.score;
					console.log(finalScoreMain, mainUser.score, otherUser.score);
					console.log("User " + (finalScoreMain >= 0 ? "won" : "lost") + " the game! Score: " + finalScoreMain);
					if (finalScoreMain >= 0)
						gameSoundEngine.playWin();
					else if (finalScoreMain < 0)
						gameSoundEngine.playLose();
				}
				else {
					gameSoundEngine.playWin();
				}
			})();
		}
	}, (gameMode != ONLINE_MULTIPL_MODE_ID));
	gameController = new GameController(gameTicker, gameState, ($intraName ? $intraName : "player1"));
	gameRenderer = new GameRenderer(canvas, gameState, scores, timer, playerLeft, playerRight, $intraName!);

	// Set up additional extensions of the game mode that only apply to certain game modes
	if (gameMode === SINGLEPL_MODE_ID)
		gameAI = new GameAI(gameTicker, gameState, gameState.player2);
	else if (gameMode == ONLINE_MULTIPL_MODE_ID)
		gameNetworkHandler = new GameNetworkHandler(gameState, io, gameState.handleOnlineState)

	// Set up the game debugger and link it to the renderer
	gameDebugger = new GameDebugger(gameAI, gameController, gameNetworkHandler, gameRenderer, gameSoundEngine, gameState);
	gameRenderer.setDebugger(gameDebugger);

	// Start playing the lobby music (which is used when waiting for the other player to be ready).
	// Only do this in online multiplayer mode, as otherwise the game is almost immediately ready
	// and the music would be cut off by the game theme.
	if (gameMode == ONLINE_MULTIPL_MODE_ID)
		gameSoundEngine.playTheme("lobby");
}

onMount(() => {
	console.log("onMount called");
	initGame();
});

onDestroy(() => {
	if (gameTicker)
		gameTicker.clear(); // For just in case
	console.log("onDestroy called");
	if (io)
		destroySocket(io);
	// reload to destroy the gameState, gameController, gameRenderer, etc.
	window.location.reload();
});

const keyUpHandler = (event: KeyboardEvent) => {
	gameController.setKeyNotPressed(event.key);
};

const keyDownHandler = (event: KeyboardEvent) => {
	// console.log(event);
	gameController.setKeyPressed(event.key);

	switch (event.key) {
		case "Escape":
			gameController.togglePause();
			break;
		case "/":
			gameRenderer.debugScreen = (gameRenderer.debugScreen ? false : true);
			break;
		case "m":
			console.log("Game muted:", gameSoundEngine.muteSound());
			break;
	};
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
				<div class="player-info left" bind:this={playerLeft}>
					<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="P1"/>
					<div class="player-info-text"><span class="player-name">Player 1</span><i>PLAYER 1</i></div>
				</div>
				<div class="score-middle">
					<b bind:this={scores} >0 : 0</b>
					<i bind:this={timer} >3:00</i>
				</div>
				<div class="player-info right" bind:this={playerRight}>
					<div class="player-info-text"><span class="player-name">Player 2</span><i>PLAYER 2</i></div>
					<img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="P2"/>
				</div>
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

	border-radius: var(--border-radius);
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

	& >div {
		flex: 1;
		display: flex;
		justify-content: left;
	}

	& > div:first-child {
		margin-right: auto;
	}

	& > div:last-child {
		margin-left: auto;
	}

	& > .score-middle {
		flex: 0 0 20%;
		justify-content: center;
		flex-direction: column;
	}

	& b {
		display: block;
		font-size: xx-large;
	}

	& i {
		display: block;
		color: var(--secondary-color);
		margin-top: 0.2em;
	}

	& .player-info {
		text-align: left;

		& .player-info-text {
			display: inline-flex;
			flex-direction: column;
			justify-content: center;
			vertical-align: middle;
			margin: 0 12px;

			& .player-name {
				display: block;
				font-size: large;
				max-width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			& i {
				display: block;
				font-size: x-small;
				text-transform: uppercase;
				margin-top: -0.5em;
			}
		}

		& img {
			display: inline-block;
			vertical-align: middle;
			border-radius: var(--border-radius);
			width: 64px;
			height: 64px;
		}
	}

	& .player-info.right {
		text-align: right;
		justify-content: right;
	}
}
</style>

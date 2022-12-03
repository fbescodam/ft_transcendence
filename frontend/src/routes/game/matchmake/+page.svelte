<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";
import { Icon, Refresh } from "svelte-hero-icons"
import Container from "$lib/Components/Container/Container.svelte";
import { onDestroy, onMount } from "svelte";
import { goto } from "$app/navigation";
import { SINGLEPL_MODE_ID, LOCAL_MULTIPL_MODE_ID, ONLINE_MULTIPL_MODE_ID } from "$lib/Game/Modes";
import { JWT } from "$lib/Stores/User";
import { initSocket } from "$lib/socketIO";
import type { Socket } from "socket.io-client";

let userInQueue = false;
let io: Socket | null = null;
let matchmakeStatus: string = "Joining the matchmaking queue...";
let statusIcon: HTMLElement;
let lobbyTheme: HTMLAudioElement | undefined;

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!);
	const selectedModeParam = $page.url.searchParams.get('mode');

	if (selectedModeParam != null) {
		const selectedModeID = parseInt(selectedModeParam);
		switch (selectedModeID) {
			case SINGLEPL_MODE_ID: // Singleplayer
			{
				matchmakeStatus = "Loading...";
				console.log("Creating singleplayer lobby");
				goto("/game/singleplayer", { replaceState: true });
				break;
			}
			case LOCAL_MULTIPL_MODE_ID: // Local Multiplayer
			{
				matchmakeStatus = "Loading...";
				console.log("Creating local multiplayer lobby");
				goto("/game/local-multiplayer", { replaceState: true });
				break;
			}
			case ONLINE_MULTIPL_MODE_ID: // Online Multiplayer
			{
				console.log("Creating online multiplayer lobby");

				// Play lobby theme
				lobbyTheme = new Audio(`http://${$page.url.hostname}:3000/audio/lobby-theme.mp3`);
				console.log(lobbyTheme.src);
				lobbyTheme.loop = true;
				lobbyTheme.play();

				// Join the matchmaking queue
				io.emit("joinQueue", {}, (ret: any) => {
					console.log("Queue joining status:", ret);
					if (ret.status === true) {
						matchmakeStatus = "Searching for players...";
						userInQueue = true;
					}
					else {
						matchmakeStatus = "Unable to join queue";
						statusIcon.style.display = "none";
						alert("Unable to join the queue. Are you maybe already in a queue or in an ongoing game?");
					}
				});

				// Handle game Start events
				io.on("gameStart", (data: any) => {
					console.log("Game start data:", data);
					matchmakeStatus = "Game starting...";
					setTimeout(function() {
						goto("/game/" + data.gameId, { replaceState: true });
					}, 2000);
				});

				// Leave queue when window unloads
				window.onbeforeunload = () => {
					if (io) {
						io.emit("leaveQueue", {}, (ret: any) => {
							console.log("Queue leaving status:", ret);
						});
					}
				}
				break;
			}
			default:
				console.warn("Invalid mode ID in matchmake", selectedModeID);
				goto("/game", { replaceState: true });
		}
	}
});

onDestroy(() => {
	console.log("onDestroy called");
	if (lobbyTheme) {
		lobbyTheme.pause();
		lobbyTheme = undefined;
	}
	if (userInQueue && io != null) {
		io.emit("leaveQueue", {}, (ret: any) => {
			console.log("Queue leaving status:", ret);
		});
	}
});

</script>

<!-- HTML -->

<div class="center">
	<Container>
		<div class="loading">
			<b>{matchmakeStatus}</b>
			<span class="icon" bind:this={statusIcon}>
				<Icon src={Refresh} size={"24px"}/>
			</span>
		</div>
	</Container>
</div>

<!-- Styling -->
<style lang="scss">
.center {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 100%;
}

.loading {
	display: flex;
	gap: 1rem;
	align-items: stretch;

	& b {
		font-size: x-large;
	}

	& .icon {
		width: 24px;
		height: 24px;
		animation-name: spin;
		animation-duration: 1000ms;
		animation-iteration-count: infinite;
		animation-timing-function: linear;

		@keyframes spin {
			to {
				transform:rotate(0deg);
			}
			from {
				transform:rotate(360deg);
			}
		}
	}

}
</style>

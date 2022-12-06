<!-- Scripting -->
<script lang="ts">
import "../global.scss"
import Logo from "$lib/Assets/Logo.gif";
import { Home, Cube, Menu, Globe, Icon, XCircle } from "svelte-hero-icons";
import NavItem from "$lib/Components/NavItem/NavItem.svelte";
import { page } from '$app/stores';
import { JWT} from "$lib/Stores/User";
// @ts-ignore ignore import as any
import DeviceDetector from "svelte-device-detector";
import AuthGuard from "$lib/Guards/AuthGuard.svelte";
import InviteModal from "$lib/Components/Modal/InviteModal.svelte";
import { onMount } from "svelte";
import type { Socket } from "socket.io-client";
import { initSocket } from "$lib/socketIO";
import { goto } from "$app/navigation";

let io: Socket;
let hasInvite: boolean = false;
let	invitedBy: string = "";
let navitems = [
	{
		href: "/",
		icon: Home,
		text: "Home",
		color: "blue",
	},
	{
		href: "/game",
		icon: Cube,
		text: "Game",
		color: "orange", 
	},
	{
		href: "/chat",
		icon: Globe,
		text: "Chat",
		color: "purple",
	},
];

// TODO: Make this work
onMount(() => {
	if (JWT == null)
		return;
	io = initSocket($page.url.hostname, $JWT!)

	io.emit('setGameInviteSocket', {})

	io.on("invite", (data) => {
		hasInvite = true;
		invitedBy = data["invitee"]
		console.log(`invited by ${data["invitee"]}`)
	});

	io.on('isGameHappening', (data) => {
		console.log(data)
		
		if (data['response'] == true)
			goto(`/game/${data["gameId"]}`)
	})
});

</script>

<!-- HTML -->

<DeviceDetector showInDevice="desktop">
	<AuthGuard />
	<!-- TODO: Change this depending on invite request -->
	<InviteModal bind:visible={hasInvite} bind:invitee={invitedBy}/>

	<!-- Render layout -->
	{#if !$page.url.pathname.startsWith("/auth")}
		<div class="layout">
			<nav class="navbar">
				<div class="top-content">
					<a href="/">
						<img class="logo" src={Logo} alt="42-logo" />
					</a>
					{#each navitems as item}
						<NavItem {...item} />
					{/each}
				</div>
				<div class="bottom-content">
					<!-- <img width="64" height="64" src="https://cdn.download.ams.birds.cornell.edu/api/v1/asset/219858341/1800" alt="profile pic"/> -->
					<NavItem href="/settings" icon={Menu} text="Settings" color="red" />
				</div>
			</nav>
			<main>
				<slot />
			</main>
		</div>
	{:else}
		<slot />
	{/if}
</DeviceDetector>

<!-- No filthy mobile users -->
<DeviceDetector showInDevice="mobile">
	<div style="background-color: #e20005; height: 100vh;">
		<div class="fuck-off">
			<Icon src={XCircle} size="8rem" />
			<h1>FUCK OFF</h1>
		</div>
	</div>
</DeviceDetector>

<!-- Styles -->
<style lang="scss">

.bottom-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;

	& img {
		border-radius: var(--border-radius);
		object-fit: cover;
	}
}

.fuck-off {
	display: flex;
	gap: 1rem;
	justify-content: center;
	align-items: center;
	height: 100%;
	flex-direction: column;
}

.layout {
	display: flex;
	position: relative;

	& main {
		overflow-y: auto;
		padding: 1rem;
		width: 100%;
		background-color: var(--background);
	}
}

.navbar {
	display: inline-flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;

	z-index: 10;
	height: 100vh; // Fallback
	min-width: fit-content;
	max-width: 1rem;
	padding: 0 8px 0 8px;

	background: var(--navbar-background);

	overflow-y: auto;
	scroll-behavior: smooth;

	&::-webkit-scrollbar {
		display: none;
	}

	& .logo {
		height: 64px;
		padding: 0.75rem;
		transition: filter 0.1s;
	}

	& .logo:hover {
		cursor: pointer;
		filter: drop-shadow(0 0 0.5em #ffffffaa);
	}

	& .top-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}
</style>

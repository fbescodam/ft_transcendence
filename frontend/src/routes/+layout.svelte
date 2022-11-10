
<!-- Scripting -->

<script lang="ts">
import "./styles.scss"
import Logo from "$lib/Assets/Logo.gif"
import { Home, Cube , Menu, Globe } from "svelte-hero-icons"
import NavItem from "$lib/Components/NavItem/NavItem.svelte";
import { page } from '$app/stores';
import { authGuard } from "$lib/Guards/AuthGuard"

let navitems = [
	{
		href: '/',
		icon: Home,
		text: 'Home',
		color: 'blue'
	},
	{
		href: '/game',
		icon: Cube,
		text: 'Game',
		color: 'orange'
	},
	{
		href: '/chat',
		icon: Globe,
		text: 'Chat',
		color: 'purple'
	},
]
</script>

<!-- HTML -->

{#if !$page.url.pathname.startsWith("/auth")}
	<div class="layout">
		<nav class="navbar">
			<div class="top-content">
				<a href="/">
					<img class="logo" src={Logo} alt="42-logo">
				</a>
				{#each navitems as item}
					<NavItem {...item}/>
				{/each}
			</div>
			<NavItem href="/settings" icon={Menu} text="Settings" color="red"/>
		</nav>
		<main>
			<slot/>
		</main>
	</div>
{:else}
	<slot/>
{/if}


<!-- Styles -->

<style lang="scss">

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

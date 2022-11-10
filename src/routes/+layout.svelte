<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
	import "./styles.scss"
	import Logo from "$lib/Assets/Logo.gif"
	import { Home, Cube , Menu, Globe } from "svelte-hero-icons"
	import NavItem from "$lib/Components/NavItem/NavItem.svelte";

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

<!-- Styles -->

<style lang="scss">

.layout {
	display: flex;
	position: relative;

	& .content {
		overflow-y: auto;
		padding: 1rem;
		width: 100%;
		flex-grow: 1;
		max-height: 100vh;
		background-color: var(--secondary-background);
	}
}

.navbar {
	display: inline-flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;

	z-index: 10;
	height: 100vh; // Fallback
  	height: calc(var(--vh, 1vh) * 100);
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

<!-- HTML -->

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
	<div class="content">
		<slot/>
	</div>
</div>
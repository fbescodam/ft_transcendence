<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Navbar item for navigation -->

<script lang="ts">
	import { Icon } from "svelte-hero-icons";
	import type { IconSource } from "svelte-hero-icons";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	/** The Icon to use for the button. */
	export let icon: IconSource;
	/** The Button text to display. */
	export let text: string;
</script>

<button on:click={() => { dispatch("click"); }}>
	<Icon src="{icon}" size="2rem"/>
	<p>{text}</p>
</button>

<style lang="scss">

p {
	font-size: 0.8rem;
}

button {
	cursor: pointer;
	display: flex;
	gap: 4px;

	align-items: center;
	justify-content: center;
	flex-direction: column;
	text-decoration: none;

	text-overflow: ellipsis;
	white-space: nowrap;

	padding: 6px;
	border-radius: 8px;
	text-align: center;

	color: white;
	background: transparent;
	
	border: solid rgba(0, 0, 0, 0) 2px;
	transition: border-color 0.1s ease-out;
	transition-delay: 0.05s;
	outline: none;

	font-size: 32px;

	width: 64px;
	height: 64px;

	&:focus {
		border-color: white;
	}
	
	&:active {
		border-color: #7f8594;
	}
	
	&:hover {
		border-color: white;
	}
}
</style>

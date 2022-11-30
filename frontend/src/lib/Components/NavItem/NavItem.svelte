<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Navbar item for navigation -->

<script lang="ts">
import { page } from '$app/stores';
import { Icon } from "svelte-hero-icons";
import type { IconSource } from "svelte-hero-icons";

/** The HREF to navigate to. */
export let href: string;
/** The Icon to use for the button. */
export let icon: IconSource;
/** The Button text to display. */
export let text: string;
/** The color when the element is hovered or selected */
export let color: string;
</script>

{#if $page.routeId == href}
	<a data-sveltekit-prefetch href={href}>
		<Icon src="{icon}" size="2rem" solid style="color: var(--{color});" />
		<p>{text}</p>
	</a>
{:else}
	<a data-sveltekit-prefetch href={href}>
		<Icon src="{icon}" size="2rem" />
		<p>{text}</p>
	</a>
{/if}

<style lang="scss">
a {
	cursor: pointer;
	display: flex;

	align-items: center;
	justify-content: center;
	flex-direction: column;
	text-decoration: none;

	text-overflow: ellipsis;
	white-space: nowrap;

	padding: 6px;
	margin: 0 0 0.5rem 0;
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

	& p {
		font-size: 0.8rem;
	}

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

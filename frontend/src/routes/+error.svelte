<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script>
	import { page } from '$app/stores';
	import Gif from "$lib/Assets/error.gif"
</script>

<!-- Styling -->

<style lang="scss">
	div {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		height: 100%;
	}

	img {
		height: 20vw;
		border-radius: var(--border-radius);
	}

	h1 {
		font-size: clamp(1.4rem, 4vw, 4rem);
		padding: 1.5rem;
	}
</style>

<!-- HTML -->

<div>
	<h1>{$page.status} : {$page.error?.message}</h1>
	<img src={Gif} alt="oopsie"/>
</div>

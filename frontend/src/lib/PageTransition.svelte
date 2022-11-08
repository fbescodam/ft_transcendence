<script>
	import { fly } from "svelte/transition";

	export let url = "";
	const pageTransitionDuration = 500;
</script>

<!-- TODO: For some reason this isn't working that great. -->

{#key url}
	<div
		in:fly={{ y: 5, duration: pageTransitionDuration }}
		out:fly={{ y: -5, duration: pageTransitionDuration }}>
		<slot />
	</div>
{/key}

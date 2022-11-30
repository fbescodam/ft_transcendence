<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

    export let type: string = "button";
</script>

<button {type} on:click={() => { dispatch("click"); }}>
	<div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
		<slot/>
	</div>
</button>

<style lang="scss">
button {
    border-radius: var(--border-radius);
    border: 1px solid transparent;
    padding: 0.4em 0.7em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: var(--component-secondary-bg);
    cursor: pointer;
    transition: all 0.25s;

    &:hover {
        border-color: var(--component-border-hover);
    }

    &:active {
        transform: scale(0.85);
    }

    &:focus,
    &:focus-visible {
        outline: none;
    }
}
</style>

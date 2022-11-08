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
    <slot/>
</button>

<style lang="scss">
button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.4em 0.7em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: var(--component-secondary-bg);
    cursor: pointer;
    transition: border-color 0.25s;

    &:hover {
        border-color: #646cff;
    }

    &:focus,
    &:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
    }
}
</style>

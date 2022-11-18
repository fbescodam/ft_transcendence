<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { createEventDispatcher } from "svelte";

const dispatch = createEventDispatcher<{key: KeyboardEvent}>()

/** The placeholder text for the input field. */
export let placeholder: string = "Text...";
</script>

<!-- HTML -->

<input {placeholder} spellcheck="false" type="text" required on:keydown={(e) => dispatch("key", e)}/>

<!-- Styling -->

<style lang="scss">
input {
	border-radius: var(--border-radius);
	border: 1px solid transparent;
	padding: 0.6em 1.2em;
	font-size: 1em;
	font-weight: 500;
	font-family: inherit;
	background-color: var(--component-secondary-bg);
	cursor: pointer;

	transition: all 0.25s;

	&:hover {
		border-color: var(--component-border-hover);
	}

	&:focus, &:focus-visible, &:active {
		outline: 4px auto -webkit-focus-ring-color;
	}

	&::placeholder {
		color: var(--foreground-unfocused);
	}
}
</style>
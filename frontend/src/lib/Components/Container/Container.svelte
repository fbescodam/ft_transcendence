<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Simple standardized, styled container -->

<!-- Scripting -->

<script lang="ts">

/** Inline styling for the container. */
export let style: string = "";

</script>

<!-- HTML -->

<div style="{style}">
    <slot/>
</div>

<!-- Styling -->

<style lang="scss">
	div {
		padding: 1rem;

		border-radius: 8px;
		border: 1px var(--component-border) solid;
		background-color: var(--component-background);
		box-shadow: 10px 20px 30px -20px rgba(0, 0, 0, 0.30);
	}
</style>


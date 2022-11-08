<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Simple standardized, styled container -->

<script lang="ts">
    export let flexGrow: number = 0;
</script>

<style lang="scss">
	div {
		margin: 0.5rem;
		padding: 1rem;

		border-radius: 8px;
		border: 1px var(--component-border) solid;
		background-color: var(--component-background);
		box-shadow: 10px 20px 30px -20px rgba(0, 0, 0, 0.30);
	}
</style>

<div style="flex-grow: {flexGrow};">
    <slot/>
</div>
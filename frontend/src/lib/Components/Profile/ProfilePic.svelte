<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";


export let avatar: string | null;
export let width: number = 64;
export let height: number = 64;
export let alt: string | null;
export let style: string = "";

</script>

<!-- HTML -->

<div style="width: {width}px; height: {height}px;">
    <!-- Picture -->
    <img width="{width}" height="{height}" src="{$page.url.protocol}//{$page.url.hostname}:3000/{avatar}" alt={alt ? alt : ""} style="{style}" />
</div>

<!-- Styling -->

<style lang="scss">

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius);
    box-sizing: border-box;
}

</style>

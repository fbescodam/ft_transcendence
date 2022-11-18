<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import { displayName, avatar } from "$lib/Stores/User";
import { page } from "$app/stores";




</script>

<!-- Styles -->

<style lang="scss">

</style>

<!-- HTML -->

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Transendence home page" />
</svelte:head>

<Container>
	<h1>Welcome {$displayName}</h1>
	<section>
		<img src="{$page.url.protocol}//{$page.url.hostname}:3000/{$avatar}" alt="Profile picture" />
	</section>
</Container>
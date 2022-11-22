<!-- Scripting -->

<script lang="ts">
	import Button from "$lib/Components/Button/Button.svelte";
	import Container from "$lib/Components/Container/Container.svelte";
	import { page } from "$app/stores";
	
	
	
	
</script>
	
<!-- Styles -->

<style lang="scss">

</style>

<!-- HTML -->

<svelte:head>
	<title>Profile</title>
	<meta name="description" content="Profile page" />
</svelte:head>

<Container>
	<h1>Profile page of {$page.params.slug}</h1>
</Container>	
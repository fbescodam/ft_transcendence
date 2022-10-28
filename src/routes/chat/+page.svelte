<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Container from "$lib/Container/Container.svelte";


</script>

<!-- Styling -->

<style lang="scss">
	h1 {
		border-bottom: 1px solid;
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		text-align: center;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.chats {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 8px;
	}
</style>

<!-- HTML -->

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Talk with your friends!" />
</svelte:head>

<div class="page">
	<Container>
		<h1>Chat Page</h1>
		<div class="chats">
			<!-- TODO: Fetch Channels and create a elements -->
		</div>
	</Container>
	<Container>
		
	</Container>
</div>

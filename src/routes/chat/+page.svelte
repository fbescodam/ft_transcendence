<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">

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

	.chat-container {
		margin: 1rem;
		padding: 2rem;

		border-radius: 8px;
		border: 1px var(--component-border) solid;
		background-color: var(--component-background);
		box-shadow: 10px 20px 30px -20px rgba(0, 0, 0, 0.30);
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
	<div class="chat-container">
		<h1>Chat Page</h1>
		<div class="chats">
			<!-- TODO: Fetch Channels and create a elements -->
		</div>
	</div>
</div>

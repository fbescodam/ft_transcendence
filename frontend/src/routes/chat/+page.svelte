<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
	import {  Globe, Chat, Plus } from "svelte-hero-icons";
	import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
	import Container from "$lib/Components/Container/Container.svelte";

	let messages = [
		{ author: 'other', text: "Yo!" }
	];

	/**
	 * When the user sends a message.
	 * @param event The Input event.
	 */
	function onSend(event: any) {
		if (event.key === 'Enter') {
			const text = event.target.value;
			if (!text) return;

			messages = messages.concat({ author: 'user', text });
			event.target.value = "";
		}
	}
</script>

<!-- Styling -->

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		height: 100%;

		& h1 {
			border-bottom: 1px solid;
			padding-bottom: 1rem;
			margin-bottom: 1rem;
			text-align: center;
		}
	}

	.channels {
		display: flex;
		overflow-x: auto;
		gap: 8px;

		& hr {
			border: 2px solid var(--component-border);
			background-color: var(--component-border);
			border-radius: 8px;
			margin: 0.5em 0.1em;
		}
	}

	.chat {
		display: flex;
		flex-direction: column;
		height: 100%;

		& .messages {
			display: flex;
			flex-direction: column;
			gap: 8px;
			margin: 0 0 0.5em 0;
			overflow-y: auto;
		}
		& span {
			padding: 0.5em 1em;
			display: inline-block;
		}

		.user {
			text-align: right;

			& span {
					color: white;
					text-align: right;
					background-color: #0074D9;
					border-radius: 1em 1em 0 1em;
			}
		}

		.other {
			text-align: left;

			& span {
				color: black;
				background-color: #eee;
				border-radius: 1em 1em 1em 0;
			}
		}
	}
</style>

<!-- HTML -->

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Talk with your friends!" />
</svelte:head>

<div class="page">
	<Container>
		<div class="channels">
			<ChatItem text="Global" icon={Globe} on:click={() => { }} />
			<hr />
			
			<!-- TODO: Fetch channels, add them -->
			<ChatItem text="Chat 1" icon={Chat} on:click={() => { }} />
			<ChatItem text="Chat 2" icon={Chat} on:click={() => { }} />
			<ChatItem text="Chat 3" icon={Chat} on:click={() => { }} />
			
			<hr />
			<ChatItem text="Add" icon={Plus} on:click={() => { }} />
		</div>
	</Container>
	<Container flexGrow={1}>
		<div class="chat">
			<h1>Pjotr</h1>
			<div class="messages">
				{#each messages as message}
					<article class={message.author}>
						<span>{message.text}</span>
					</article>
				{/each}
			</div>
			<input on:keydown={onSend}>
		</div>
	</Container>
</div>

<!-- Scripting -->
<script lang="ts">
import { Globe, Chat, Plus } from "svelte-hero-icons";
import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import Button from "$lib/Components/Button/Button.svelte";

let textInput: HTMLInputElement;
let messages = [{ author: "other", type: "other" ,text: "Yo!" }];
let currentChannel: { name: string, id: number } = { name: "Global", id: 0 };
let channels = [
    { name: "Chat 1", id: 123 },
    { name: "Chat 2", id: 123 },
    { name: "Chat 3", id: 123 },
    { name: "Chat 1", id: 123 },
    { name: "Chat 2", id: 123 },
    { name: "Chat 3", id: 123 },
    { name: "Chat 1", id: 123 },
    { name: "Chat 2", id: 123 },
    { name: "Chat 3", id: 123 },
    { name: "Chat 1", id: 123 },
    { name: "Chat 2", id: 123 },
    { name: "Chat 3", id: 123 },
];

/**
 * When the user sends a message.
 * @param event The Input event.
 */
function onSend(event: any) {
	event.preventDefault();
	const text = textInput.value;
	messages = messages.concat({ author: 'user', text: text, type: "user" });
	textInput.value = "";
}
</script>

<!-- HTML -->

<svelte:head>
    <title>Chat</title>
    <meta name="description" content="Talk with your friends!" />
</svelte:head>

<div class="content">
	<!-- Channel Selection -->
	<Container>
		<menu class="channels">
			<ChatItem text="Global" icon={Globe} on:click={() => {
				currentChannel = { name: "Global", id: 0 };
			}} />
			<hr />
			{#each channels as channel}
				<ChatItem
					text={channel.name}
					icon={Chat}
					on:click={() => {
						currentChannel = channel;
						// TODO: Fetch and update the messages array.
					}}
				/>
			{/each}
			<hr />
			<ChatItem text="Add" icon={Plus} on:click={() => {
				// TODO: Modal popup, then handle, switch to channel.
			}} />
		</menu>
	</Container>
	<hr />
	<!-- Channel messages -->
	<Container style="flex: 1; display: flex; flex-direction: column;">
		<h1>{currentChannel.name}</h1>
		<hr />
		<section class="chat">
			<div class="messages">
				<!-- TODO: Improve styling on these. -->
				{#each messages as message}
					<article id={message.type} >{message.text}</article>
				{/each}
			</div>
			<form on:submit={onSend}>
				<input required bind:this={textInput} type="text"/>
				<Button type="submit">Send</Button>
			</form>
		</section>
	</Container>
</div>

<!-- Styling -->
<style lang="scss">

.content {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.channels {
    display: inline-flex;
    overflow-x: auto;
	max-width: 100%;
    gap: 8px;
}

.chat {
	flex: 1;
	display: flex;
    padding: 1rem;
	flex-direction: column;

	& .messages {
		flex: 1;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;

		& #user {
			text-align: right;
		}
	}

	& form {
		display: flex;
		gap: 10px;
		width: 100%;

		& input {
			flex: 1;
		}
	}
}

</style>


<!-- <ul class="messages">
	{#each messages as message}
		<li kind={message.type} >{message.text}</li>
	{/each}
</ul>
<hr />
<form on:submit={onSend}>
	<input type="text"/>
	<Button type="submit">Bruh</Button>
</form> -->

<!-- .chat {
	display: block;
	& .messages {
		overflow-y: auto;
		max-height: 500px;
	}

	& form {
		display: flex;
		flex-direction: row;
		gap: 8px;

		& input {
			flex: 1;
			padding: 0px 8px;
			border-style: none;
			border-radius: var(--border-radius);
		}
	}
} -->
<!-- Scripting -->
<script context="module" lang="ts">
import {  Globe, Chat, Plus } from "svelte-hero-icons";
import { onMount } from "svelte";
import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import { initSocket } from "$lib/socketIO";
import { user } from "$lib/Stores/User";
import { channels } from "$lib/Stores/Channel";
import ChatAddModal from "$lib/Components/Modal/ChatAddModal.svelte";
import TextInput from "$lib/Components/TextInput/TextInput.svelte";
</script>

<script lang="ts">
	let showAddModal: boolean = false;
	let io: any;
	let messages: Array<any> = [];
	let openChannel = "Global";
	let currentUser = $user

	onMount(() => {
		io = initSocket()
		updateMessages("Global");

		io.on("sendMsg", function (message: any) { // Listen to the message event
			if (message.channel == openChannel)
				messages = [...messages, { senderName: message.user, text: message.text}]
		})

		io.emit('getChannelsForUser', {user: currentUser}, function (answer: any) {
			$channels = answer;
			io.emit('joinRooms', {channels:$channels.map((el: any) => el.channelName)});
		});

	})

	function updateMessages(channelName: string) {
		io.emit('getMessagesFromChannel', {name:channelName}, (answer: any) =>
			messages = answer);
	}

	/**
	 * When the user sends a message.
	 * @param data The even data.
	 */
	function onSend(data: CustomEvent<KeyboardEvent>) {
		const event = data.detail as KeyboardEvent;
		const input = event.target as HTMLInputElement;

		if (event.key === 'Enter') {
			if (!input.value) {
				return;
			}
			console.log("Sending message:", input.value);
			io.emit("sendMsg", {inChannel: openChannel, text: input.value});
			input.value = "";
		}
	}
</script>

<!-- HTML -->

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Talk with your friends!" />
</svelte:head>

<div class="page">
	<!-- PopUps -->
	<ChatAddModal bind:visible={showAddModal}/>

	<!-- Channels -->
	<Container>
		<div class="channels">
			{#each $channels as channel}
				<ChatItem text={channel["channelName"]}
				icon={channel["channelName"] == "Global" ? Globe : Chat}
				on:click={() => {openChannel = channel["channelName"]; updateMessages(channel["channelName"])}} />
			{/each}
			<hr />
			<ChatItem text="Add" icon={Plus} on:click={() => { showAddModal = true; }} />
		</div>
	</Container>
	<hr />

	<!-- Chat messages -->
	<Container style="flex: 1;">
		<div class="chat">
			<h1>{openChannel}</h1>
			<section class="messages">
				{#if messages.length == 0}
					<b> No messages...</b>
				{:else}
					{#each messages as message}
						<article id={message.senderName == currentUser ? "user" : "other"}>
							<span>{message.text}</span>
							<b>{message.senderName}</b>
						</article>
					{/each}
				{/if}
			</section>
			<TextInput on:key={onSend}/>
		</div>
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
	gap: 20px;
	padding: 1rem;
	flex-direction: column;

	& .messages {
		flex: 1;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 400px;
		overflow-y: auto;
		min-height: 400px;
		padding: 0 10px;

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

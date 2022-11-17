<!-- Scripting -->
<script context="module" lang="ts">
import {  Globe, Chat, Plus, ClipboardCheck } from "svelte-hero-icons";
import { onMount } from "svelte";
import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import { initSocket } from "$lib/socketIO";
import { user } from "$lib/Stores/User";
import { channels } from "$lib/Stores/Channel";
import ChatAddModal from "$lib/Components/Modal/ChatAddModal.svelte";
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
	 * @param event The Input event.
	 */
	function onSend(event: any) {
		if (event.key === 'Enter') {
			const text = event.target.value;
			if (!text) return;
			io.emit("sendMsg", {inChannel: openChannel, text: text});
			
			event.target.value = "";
		}
	}
</script>

<!-- HTML -->

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Talk with your friends!" />
</svelte:head>

<div class="page">
	<ChatAddModal bind:visible={showAddModal}/>
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
	<Container style="flex: 1;">
		<div class="chat">
			<h1>{openChannel}</h1>
			<div class="messages">
				{#if messages.length == 0}
					<article id="other">
						<span>no messages for this channel</span>
					</article>
				{:else}
					{#each messages as message}
						<article id={message.senderName == currentUser ? "user" : "other"}>
							<span>{message.text}</span>
							<span>{message.senderName}</span>
						</article>
					{/each}
				{/if}
			</div>
			<input on:keydown={onSend}>
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

<!-- Scripting -->
<script context="module" lang="ts">
import {  Globe, Chat, Plus } from "svelte-hero-icons";
import { page } from '$app/stores';
import { afterUpdate, beforeUpdate, onMount, onDestroy } from "svelte";
import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import { initSocket, destroySocket } from "$lib/socketIO";
import { displayName, JWT } from "$lib/Stores/User";
import { channels } from "$lib/Stores/Channel";
import ChatAddModal from "$lib/Components/Modal/ChatAddModal.svelte";
import TextInput from "$lib/Components/TextInput/TextInput.svelte"
import ChatSettingsModal from "$lib/Components/Modal/ChatSettingsModal.svelte";import Button from "$lib/Components/Button/Button.svelte";
import type { Socket } from "socket.io-client";
;
</script>

<script lang="ts">
let showAddModal: boolean = false;
let io: Socket;
let messages: Array<any> = [];
let openChannel = "Global";
let currentChannel: any;
let currentUser = $displayName
let chat: HTMLDivElement;
let autoscroll: boolean;
let blockedUsers: any
let showSettingsModal: boolean = false;

beforeUpdate(() => {
	autoscroll = chat && (chat.offsetHeight + chat.scrollTop) > (chat.scrollHeight - 20);
});

afterUpdate(() => {
	if (autoscroll)
		chat.scrollTo(0, chat.scrollHeight);
});

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)
	updateMessages("Global");
	// Listen to the message event
	io.on("sendMsg", function (message: any) {
		if (message.channel == openChannel)
		{
			if (!(blockedUsers.map((item: any) => item['name']).includes(message.user)))
				messages = [...messages, { senderName: message.user, text: message.text}];
		}
	});
	// Get channels from the user
	io.emit('getChannelsForUser', {user: currentUser}, function (answer: any) {
		$channels = answer;
		io.emit('joinRooms', {channels:$channels.map((el: any) => el.channelName)});
	});
	currentChannel = $channels[0];
	io.emit('getBlockedUsers', {}, function (e: any) {
		blockedUsers = e;
	})
});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

function updateMessages(channelName: string) {
	io.emit('getMessagesFromChannel', {name:channelName}, (answer: any) => {
		if ("error" in answer) {
			alert(answer.error);
			return;
		}
		messages = answer
	});
}

function leaveChannel() {
	io.emit('leaveChannel', {name:currentChannel.channelName}, (answer: any) => {
		if ("error" in answer) {
			alert(answer.error);
			return;
		}
	})
	window.location.reload();
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

		currentChannel = $channels.find((el: any) => el.channelName == openChannel);
		if (currentChannel.channelName == openChannel && currentChannel.role == 'MUTED') {
			alert("Stfu you fat mofo, your bitch ass got muted.");
			return;
		}

		io.emit("sendMsg", {inChannel: openChannel, text: input.value});
		input.value = "";
	}
}

function switchChannel(channel: any) {
	console.log(channel)
	openChannel = channel["channelName"]
	currentChannel = channel;
	updateMessages(channel["channelName"])
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
	<ChatSettingsModal bind:visible={showSettingsModal} bind:channel={currentChannel}/>

	<!-- Channels -->
	<Container>
		<div class="channels">
			{#each $channels as channel}
				<ChatItem text={channel["channelName"]}
				icon={channel["channelName"] == "Global" ? Globe : Chat}
				on:click={() => {switchChannel(channel)}} />
			{/each}
			<hr />
			<ChatItem text="Add" icon={Plus} on:click={() => { showAddModal = true; }} />
		</div>
	</Container>
	<hr />

	<!-- Chat messages -->
	<Container style="flex: 1;">
		{#if currentChannel != undefined && currentChannel.name != "Global" && currentChannel.role === "ADMIN"}
		<Button on:click={() => {showSettingsModal = true}}>Settings</Button>
		<Button on:click={() => {leaveChannel()}}>Leave channel</Button>
		{/if}
		<div class="chat">
			<h1>{openChannel}</h1>
			<div class="messages" bind:this={chat}>
				{#if messages.length == 0}
					<b> No messages...</b>
				{:else}
					{#each messages as message}
						<article>
							<a href="/profile/{message.senderName}">
								<b>
									{message.senderName}:
								</b>
							</a>
							<span>{message.text}</span>
						</article>
					{/each}
				{/if}
			</div>
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
		scroll-behavior: smooth;
		min-height: 400px;
		padding: 0 10px;

		background: linear-gradient(var(--component-background) 30%,rgba(255,255,255,0)),linear-gradient(rgba(255,255,255,0),var(--component-background) 70%) 0 100%,radial-gradient(farthest-side at 50% 0,rgba(0,0,0,.2),rgba(0,0,0,0)),radial-gradient(farthest-side at 50% 100%,rgba(0,0,0,.2),rgba(0,0,0,0)) 0 100%;
		background-repeat: no-repeat;
		background-size: 100% 40px,100% 40px,100% 14px,100% 14px;
		background-attachment: local,local,scroll,scroll;

		a {
			text-decoration: none;
			color: #9fa0f9;
		}

		&::-webkit-scrollbar {
			display: none;
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

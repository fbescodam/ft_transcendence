<!-- Scripting -->
<script context="module" lang="ts">
import { page } from '$app/stores';
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
import ChatAddModal from "$lib/Components/Modal/ChatAddModal.svelte";
import ChatSettingsModal from "$lib/Components/Modal/ChatSettingsModal.svelte";
import TextInput from "$lib/Components/TextInput/TextInput.svelte";
import { destroySocket, initSocket } from "$lib/socketIO";
import { channels } from "$lib/Stores/Channel";
import { displayName, JWT, intraName } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
import { Chat, ChatAlt, Globe, Plus } from "svelte-hero-icons";
;
</script>

<script lang="ts">
let showAddModal: boolean = false;
let io: Socket;
let messages: { senderDisName: string, senderIntraName: string, text: string }[] = [];
let openChannel = "Global";
let currentChannel: any;
let currentUser = $displayName
let chat: HTMLDivElement;
let autoscroll: boolean;
let blockedUsers: any = undefined;
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
	io.emit('getBlockedUsers', {}, function (e: any) {
		blockedUsers = e;
		console.log("blockedUsers:", blockedUsers);
	});
	// Listen to the message event
	io.on("sendMsg", async function (message: any) {
		console.log(message);
		// wait for blockedUsers to load
		while (!blockedUsers)
			await new Promise(resolve => setTimeout(resolve, 100));
		if (message.channel == openChannel) {
			if (!(blockedUsers.map((item: any) => item).includes(message.userIntraName)))
				messages = [...messages, { senderDisName: message.user, senderIntraName: message.userIntraName, text: message.text}];
		}
	});
	// Get channels from the user
	io.emit('getChannelsForUser', {user: currentUser}, function (answer: any) {
		$channels = answer;
		console.log("channels:", answer);
		io.emit('joinRooms', {channels:$channels.map((el: any) => el.channelName)});
	});

	currentChannel = $channels[0];
	updateMessages("Global");

});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

function updateMessages(channelName: string) {
	io.emit('getMessagesFromChannel', {name:channelName}, async (answer: any) => {
		if ("error" in answer) {
			alert(answer.error);
			return;
		}
		messages = []
		for (const msg in answer) {
			// wait for blockedUsers to load
			while (!blockedUsers)
				await new Promise(resolve => setTimeout(resolve, 100));
			if (!(blockedUsers.map((item: any) => item).includes(answer[msg].senderName))) {
				messages = [...messages, {
					senderDisName: answer[msg].senderDisName,
					senderIntraName: answer[msg].senderName,
					text: answer[msg].text
				}]
			}
		}
	});
}

function leaveChannel() {
	io.emit('leaveChannel', {name:currentChannel.channelName}, (answer: any) => {
		if ("error" in answer) {
			alert(answer.error);
			return;
		}
		else
			window.location.reload();
	})
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

		io.emit("sendMsg", {inChannel: openChannel, text: input.value}, (ret: any) => {
			console.log(ret);
			if ("error" in ret) {
				alert(ret.error);
				return;
			}
		});
		input.value = "";
	}
}

function switchChannel(channel: any) {
	openChannel = channel["channelName"]
	currentChannel = channel;
	updateMessages(channel["channelName"])
}

function getDMWith(channel: any) {
	for (const user of channel.users) {
		if (user.userName != $intraName)
			return user.userName;
	}
	return "???";
}

function getChannelIcon(channel: any) {
	if (channel.role == "DMOWNER") {
		return Chat;
	}
	if (channel.channelName == "Global")
		return Globe;
	return ChatAlt;
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
				<ChatItem text={(channel["role"] == "DMOWNER" ? getDMWith(channel) : channel["channelName"])} selected={channel["channelName"] == openChannel}
				icon={getChannelIcon(channel)}
				on:click={() => {switchChannel(channel)}} />
			{/each}
			<hr />
			<ChatItem text="Add" icon={Plus} on:click={() => { showAddModal = true; }} />
		</div>
	</Container>
	<hr />

	<!-- Chat messages -->
	<Container style="flex: 1;">
		{#if currentChannel != undefined && currentChannel.name != "Global" && (currentChannel.role === "ADMIN" || currentChannel.role === "OWNER")}
		<Button on:click={() => {showSettingsModal = true}}>Settings</Button>
		{/if}
		{#if currentChannel != undefined && currentChannel.name != "Global" && currentChannel.role !== "DMOWNER"}
		<Button on:click={() => {leaveChannel()}}>Leave channel</Button>
		{/if}
		<div class="chat">
			<h1>{openChannel}</h1>
			<div class="messages" bind:this={chat}>
				{#if messages.length == 0}
					<b>No messages...</b>
				{:else}
					<ul>
						{#each messages as message}
							<li><a href="/profile/{message.senderIntraName}"><b>{message.senderDisName}</b></a>:&nbsp;<span>{message.text}</span></li>
						{/each}
					</ul>
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

		& ul {
			list-style-type: none;
			margin: 0;
		}

		a {
			text-decoration: none;
			color: #9fa0f9;

			&:hover {
				text-decoration: underline;
			}
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

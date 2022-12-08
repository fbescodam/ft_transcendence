<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->
<script lang="ts">
import { destroySocket, initSocket } from "$lib/socketIO";
import type { User } from "$lib/Types";
import { afterUpdate, beforeUpdate, onDestroy, onMount } from "svelte";
import { JWT } from "$lib/Stores/User";
import Container from "../Container/Container.svelte";
import { page } from '$app/stores';
import TextInput from "../TextInput/TextInput.svelte";
import type { Socket } from "socket.io-client";

// ----------------------------------------------------------------------------

export let otherUser: string;

let io: Socket
let chat: HTMLDivElement;
let autoscroll: boolean;
let messages: { senderDisName: string, senderIntraName: string, text: string }[] = [];

let channel: any;
// ----------------------------------------------------------------------------

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)

	io.on("sendMsg", function (message: any) {
		messages = [...messages, { senderDisName: message.user, senderIntraName: message.userIntraName, text: message.text}];
	});

	io.emit('checkDmExistence', {user2:otherUser}, function (e:any) {
		if (e["channel"] == null) {
			io.emit('createDirectChannel', {user2:otherUser}, function (e:any) {
				channel = e
			})
		}
		else
			channel = e["channel"]
		io.emit('getMessagesFromChannel', {name:channel}, function (answer: any) {
			messages = []
			for (const msg in answer) {
				messages = [...messages,
					{senderDisName: answer[msg].senderDisName,
					senderIntraName: answer[msg].senderName,
					text: answer[msg].text}
				]
			}
		});
		io.emit('joinRooms', {channels:[channel]});
	})
});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

beforeUpdate(() => {
	autoscroll = chat && (chat.offsetHeight + chat.scrollTop) > (chat.scrollHeight - 20);
});

afterUpdate(() => {
	if (autoscroll)
		chat.scrollTo(0, chat.scrollHeight);
});

function onSend(data: CustomEvent<KeyboardEvent>) {
	const event = data.detail as KeyboardEvent;
	const input = event.target as HTMLInputElement;

	if (event.key === 'Enter') {
		if (!input.value)
			return;

		console.log("Sending message:", input.value);
		io.emit("sendMsg", {inChannel: channel, text: input.value}, (ret: any) => {
			console.log(ret);
			if ("error" in ret) {
				alert(ret.error);
				return;
			}
		});
		input.value = "";
	}
}

</script>

<!-- HTML -->

<div class="chatcontainer">
	<Container>
		<details>
			<summary>
				<b>DM</b>
			</summary>
			<div class="chat" bind:this={chat}>
				{#each messages as message}
				<div class="msg">
					<b> {message.senderDisName}: </b>
					<span>{message.text}</span>
				</div>
				{/each}
			</div>
			<hr/>
			<TextInput on:key={(e) => {onSend(e)}}/>
		</details>
	</Container>
</div>

<!-- Styling -->
<style lang="scss">

.chatcontainer {
	max-width: 50%;
	position: fixed;
	right: 0px;
	bottom: 0px;
}

details {
	display: block;
	max-width: 100%;

	&[open] {
		width: 800px;
	}

	&[open] summary {
		margin-bottom: 16px;
	}

	& .chat {
		max-height: 400px;
		overflow-y: auto;
		scroll-behavior: smooth;
		min-height: 200px;
		padding: 0 10px;

		background: linear-gradient(var(--component-background) 30%,rgba(255,255,255,0)),linear-gradient(rgba(255,255,255,0),var(--component-background) 70%) 0 100%,radial-gradient(farthest-side at 50% 0,rgba(0,0,0,.2),rgba(0,0,0,0)),radial-gradient(farthest-side at 50% 100%,rgba(0,0,0,.2),rgba(0,0,0,0)) 0 100%;
		background-repeat: no-repeat;
		background-size: 100% 40px,100% 40px,100% 14px,100% 14px;
		background-attachment: local,local,scroll,scroll;

		& .msg {
			word-wrap: break-word;
	}
}
}

</style>

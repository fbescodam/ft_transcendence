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
let messages: { senderName: string, text: string }[] = [
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
	{senderName: "faggot", text: "fuck off"},
]

let channel: any;
// ----------------------------------------------------------------------------

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)

	io.on("sendMsg", function (message: any) {
			messages = [...messages, { senderName: message.user, text: message.text}];
	});

	io.emit('checkDmExistence', {user2:otherUser}, function (e:any) {
		if (e["channel"] == null)
		{
			io.emit('createDirectChannel', {user2:otherUser}, function (e:any) {
				channel = e
			})
		}
		else
			channel = e["channel"]
		io.emit('getMessagesFromChannel', {name:channel}, (answer: any) =>
			messages = answer);
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

function updateMessages() {
	// TODO: Handle message updates
}

function onSend(data: CustomEvent<KeyboardEvent>) {
	const event = data.detail as KeyboardEvent;
	const input = event.target as HTMLInputElement;

	// TODO: Send
	if (event.key === 'Enter') {
		if (!input.value)
			return;

		console.log("Sending message:", input.value);
		io.emit("sendMsg", {inChannel: channel, text: input.value});
		input.value = "";
	}
}

</script>

<!-- HTML -->

<Container>
	<details>
		<summary>
			<b>DM</b>
		</summary>
		<div class="chat" bind:this={chat}>
			{#each messages as message}
			<article>
				<b> {message.senderName}: </b>
				<span>{message.text}</span>
			</article>
			{/each}
		</div>
		<hr/>
		<TextInput on:key={(e) => {onSend(e)}}/>
	</details>
</Container>

<!-- Styling -->
<style lang="scss">

.chat {
	max-height: 400px;
	overflow-y: auto;
	scroll-behavior: smooth;
	min-height: 200px;
	padding: 0 10px;

	background: linear-gradient(var(--component-background) 30%,rgba(255,255,255,0)),linear-gradient(rgba(255,255,255,0),var(--component-background) 70%) 0 100%,radial-gradient(farthest-side at 50% 0,rgba(0,0,0,.2),rgba(0,0,0,0)),radial-gradient(farthest-side at 50% 100%,rgba(0,0,0,.2),rgba(0,0,0,0)) 0 100%;
	background-repeat: no-repeat;
	background-size: 100% 40px,100% 40px,100% 14px,100% 14px;
	background-attachment: local,local,scroll,scroll;
}

</style>

<!-- Scripting -->
<script lang="ts">
	import {  Globe, Chat, Plus, ClipboardCheck } from "svelte-hero-icons";
	import { io } from "$lib/socketIO";
	import { onMount } from "svelte";
	import ChatItem from "$lib/Components/IconButton/IconButton.svelte";
	import Container from "$lib/Components/Container/Container.svelte";

	let messages: Array<any> = [];
	let channels: any = []
	let openChannel = "Global";
	let currentUser = 'AdminUser'; //TODO: need to do auth huh

	onMount(() => {
		updateMessages("Global");

        io.on("sendMsg", message => { // Listen to the message event
            messages = [...messages, { senderName: 'AdminUser', text: message}]
        })

		//TODO: admin is username
		io.emit('getChannelsForUser', 'AdminUser', function (answer: any) {
			channels = answer;
			io.emit('joinRooms', channels.map((el: any) => el.channelName));
		});

    })

	function updateMessages(channelName: string) {
		io.emit('getMessagesFromChannel', channelName, (answer: any) =>
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
			io.emit("sendMsg", {inChannel: openChannel, text: text, senderName: 'AdminUser'});

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
	<Container>
		<div class="channels">
			{#each channels as channel}
				<ChatItem text={channel.channelName}
				icon={channel.channelName == "Global" ? Globe : Chat}
				on:click={() => {openChannel = channel.channelName; updateMessages(channel.channelName)}} />
			{/each}
			<hr />
			<ChatItem text="Add" icon={Plus} on:click={() => { }} />
		</div>
	</Container>
	<Container flexGrow={1}>
		<div class="chat">
			<h1>{openChannel}</h1>
			<div class="messages">
				{#if messages.length == 0}
					<article class="other">
						<span>no messages for this channel</span>
					</article>
				{:else}
					{#each messages as message}
						<article class={message.senderName == currentUser ? "user" : "other"}>
							<span>{message.text}</span>
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

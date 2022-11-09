<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

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
		io.emit('getChannelsForUser', 'AdminUser', (answer: any) => 
			channels = answer); 

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
			io.emit("sendMsg", {inChannel: 'Global', text: text, senderName: 'AdminUser'});

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
			{#each channels as channel}
				<ChatItem text={channel.name} 
				icon={channel.name == "Global" ? Globe : Chat} 
				on:click={() => {openChannel = channel.name;updateMessages(channel.name)}} />
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
				{/if}
				{#each messages as message}
					<article class={message.senderName == currentUser ? "user" : "other"}>
						<span>{message.text}</span>
					</article>
				{/each}
			</div>
			<input on:keydown={onSend}>
		</div>
	</Container>
</div>

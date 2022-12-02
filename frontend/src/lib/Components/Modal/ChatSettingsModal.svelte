
<!-- Scripting -->

<script lang="ts">
import { initSocket } from "$lib/socketIO";
import { page } from '$app/stores';
import { channels } from "$lib/Stores/Channel";
import { JWT } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { onMount } from "svelte";
import Button from "../Button/Button.svelte";
import Modal from "./Modal.svelte";
import type { User } from "$lib/Types";

//= Properties =//

/** Should the modal be visible */
export let visible: boolean = false;
export let channel: any;

//= Variables =//

let io: Socket;
let users: User[] = [];

//= Methods =//

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)

	io.emit('getUsers', {channelName: channel.channelName}, function (answer: any) {
		if (answer.error)
			console.log(answer.error)
		else
			users = answer.users
	});

	console.log(users)
});

function onCancel() {
	visible = false;
}

function updateSettings(e: SubmitEvent) {
	e.preventDefault();
}

</script>

<!-- HTML -->

<Modal bind:visible={visible} style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: space-around; margin: 1rem 0;">
		<form on:submit={(e) => {updateSettings(e)}}>
			a
		</form>
    </div>
    <Button on:click={onCancel}>Cancel</Button>
</Modal>

<!-- Styling -->

<style lang="scss">

</style>


<!-- Scripting -->

<script lang="ts">
import { initSocket, destroySocket } from "$lib/socketIO";
import { page } from '$app/stores';
import { JWT } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { onMount, onDestroy } from "svelte";
import Button from "../Button/Button.svelte";
import Modal from "./Modal.svelte";
import { goto } from "$app/navigation";

//= Properties =//

/** Should the modal be visible */
export let visible: boolean = false;

export let invitee: string;



//= Variables =//

let accepted: boolean;
let io: Socket;

//= Methods =//

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)

});

onDestroy(() => { if (io) destroySocket(io); });


function sendRes() {
	if (accepted === false)
		return io.emit('inviteResponse', {response:accepted, invitee:invitee})

	io.emit('inviteResponse', {response:accepted, invitee:invitee}, (data:any) => {
		goto(`/game/${data["gameId"]}`, { replaceState: false })
	})
}

function onCancel() {
	accepted = false
	visible = false;
	sendRes()
}

function onJoin(e: SubmitEvent) {
	e.preventDefault();

	visible = false;
	accepted = true
	sendRes()


}

</script>

<!-- HTML -->

<Modal bind:visible={visible} style="display: flex; flex-direction: column;">
	<div style="display: flex; margin: 1rem 0; overflow: auto; gap: 10px">
		<form on:submit={(e) => { onJoin(e) }}>
			<h1>{invitee} invited you to a game!</h1>
			<hr/>
			<div class="choice">
				<Button style="flex: 1;" type="submit">Sure</Button>
				<Button style="flex: 1;" on:click={onCancel}>Fuck off</Button>
			</div>
		</form>
	</div>
</Modal>

<!-- Styling -->

<style lang="scss">
.choice {
	flex: 1;
	display: flex;
    align-items: center;
	justify-content: center;
    gap: 10px;
}
</style>

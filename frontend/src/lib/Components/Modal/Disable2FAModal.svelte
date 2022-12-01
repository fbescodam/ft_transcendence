
<!-- Scripting -->

<script lang="ts">
import { initSocket } from "$lib/socketIO";
import { JWT } from "$lib/Stores/User";
import { page } from '$app/stores';
import type { Socket } from "socket.io-client";
import { onMount } from "svelte";
import Button from "../Button/Button.svelte";
import Modal from "./Modal.svelte";

//= Properties =//

/** Should the modal be visible */
export let visible: boolean = false;
export let tfaEnabled: boolean = false;

//= Variables =//

let io: Socket;
let authCode: HTMLInputElement;

//= Methods =//

onMount(() => io = initSocket($page.url.hostname, $JWT!));

/** Handler for closing the modal. */
function onCancel() {
	visible = false;
}

function disable2FA() {
	io.emit('disableTfaAuth', {tfaCode: authCode.value}, function(e:any) {
	if ("error" in e) {
		authCode.setCustomValidity("Invalid code!");
		authCode.reportValidity();
		return;
	}
	$JWT = e["token"];
	console.log("2fa disabled");
	tfaEnabled = false;
	visible = false;
})
}

</script>

<!-- HTML -->

<Modal bind:visible={visible} style="display: flex; flex-direction: column;">
	<div class="content">
		<h1>Disable 2FA Authentication</h1>
		<hr/>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label>Please enter your code</label>
		<input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" bind:this={authCode}/>

		<hr/>

		<div class="actions">
			<form on:submit={(e) => { e.preventDefault() }}>
				<Button on:click={() => disable2FA()}>Disable 2FA</Button>
			</form>
			<Button on:click={() => visible = false}>Cancel</Button>
		</div>
	</div>
</Modal>

<!-- Styling -->

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.actions {
			display: flex;
			justify-content: space-between;
		}
	}
</style>

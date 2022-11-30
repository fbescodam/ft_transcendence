
<!-- Scripting -->

<script lang="ts">
import { initSocket } from "$lib/socketIO";
import { channels } from "$lib/Stores/Channel";
import { JWT } from "$lib/Stores/User";
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
let qrcode: string;
let authCode: HTMLInputElement;

//= Methods =//

onMount(() => io = initSocket($JWT!));

/** Handler for closing the modal. */
function onCancel() {
	visible = false;
}

function enableTFA() {
	
	io.emit('enableTfaAuth', {tfaCode: authCode.value}, function(e:any) {
		if ("error" in e) {
			authCode.setCustomValidity("Invalid code!");
			authCode.reportValidity();
			return;
		}
		$JWT = e["token"];
		console.log("2fa enabled");
		tfaEnabled = true;
		visible = false;
		qrcode = undefined;
	})
}

function getQRCode() {
	io.emit('getQrCode', {}, function(e:any) {
		console.log(e)
		$JWT = e["token"]
		qrcode = e["qrcode"]
	})
}


</script>

<!-- HTML -->

<Modal bind:visible={visible} style="display: flex; flex-direction: column;">
	<div class="content">
		<h1>2FA Authentication</h1>
		<hr/>
		<div style="display: flex; align-items: center; justify-content: center;">
			{#if qrcode === undefined}
				<b>Request a new QRCode!</b>
			{:else}
				<img id="QRCode" src={qrcode} alt="qr-code"/>
			{/if}
		</div>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label>Please enter the code by scanning the QR:</label>
		<input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" bind:this={authCode}/>

		<hr/>

		<div class="actions">
			<form on:submit={(e) => { e.preventDefault() }}>
				<Button on:click={() => getQRCode()}>Get QRCode</Button>
				<Button on:click={() => enableTFA()}>Send Code</Button>
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
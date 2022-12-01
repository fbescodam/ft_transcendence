<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import { initSocket } from "$lib/socketIO";
import { displayName, JWT } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { onMount } from "svelte";
import { page } from "$app/stores";

let io: Socket;
let qrcode: string;

// TODO: Check if the user has tfa enabled.
let tfaEnabled: boolean = false;
let newUsername: HTMLInputElement;
let authCode: HTMLInputElement;

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)
	io.emit("isTfaEnabled", {}, (data: { tfaEnabled: boolean }) => {
		tfaEnabled = data.tfaEnabled;
		console.log(tfaEnabled);
	});
});

/**
 * Change the name of the user
 * @param e The submit event
 */
function changeUsername(e: SubmitEvent) {
	e.preventDefault()

	console.log("penis");
	io.emit('changeDisplayName', {newDisplayName : newUsername.value}, function(answer: any) {
		console.log(answer);
		if ("error" in answer)
		{
			newUsername.setCustomValidity(answer.error);
			return console.log("error: %s", answer.error);
		}
		$displayName = newUsername.value;
		$JWT = answer["token"]
		newUsername.value = '';
	})
}

function logOut() {
	$JWT = null;
}

//this is how you check a code
function checkCode(e: SubmitEvent) {
	e.preventDefault()

	io.emit('enableTfaAuth', {tfaCode: authCode.value}, function(answer:any) {
		if ("error" in answer) {
			authCode.setCustomValidity("Invalid code!");
			return;
		}
		$JWT = answer["token"]
		console.log(answer)
	});
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

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Change your user settings" />
</svelte:head>

<div class="page">
	<Container>
		<h2>Settings</h2>
	</Container>
	<hr />
	<Container style="flex: 1;">

		<!-- User Data -->
		<!-- TODO: Any extra settings ? -->
		<form on:submit={(e) => { changeUsername(e); }}>
			<fieldset>
				<legend>User Data</legend>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label>Username:</label>
				<input type="text" bind:this={newUsername} placeholder={$displayName} required/>
				<hr/>
				<Button type="submit">Submit</Button>
			</fieldset>
		</form>

		<br/>

		<!-- Authentication -->
		<form on:submit={(e) => checkCode(e)}>
			<fieldset>
				<legend>Authentication</legend>

				<Button on:click={() => { tfaEnabled = !tfaEnabled }} >
					{#if tfaEnabled}
						Enable 2FA
					{:else}
						Disable 2FA
					{/if}
				</Button>

				{#if !tfaEnabled}
					<hr/>
					{#if qrcode === undefined}
						<b>Request a new QRCode!</b>
					{:else}
						<img id="QRCode" src={qrcode} alt="qr-code"/>
					{/if}
					<br/>
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label>Please enter the code by scanning the QR:</label>
					<input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" bind:this={authCode}/>

					<hr/>
					<Button type="submit">Send Code</Button>
					<Button on:click={() => getQRCode()}>Get QRCode</Button>
				{/if}
				</fieldset>
		</form>

		<br/>

		<!-- Logout -->
		<form>
			<fieldset>
				<legend>Logout</legend>
				<Button type="submit" on:click={logOut}>Log out</Button>
			</fieldset>
		</form>
	</Container>
</div>


<!-- Styles -->

<style lang="scss">
	h1 {
		border-bottom: 1px solid;
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		text-align: center;
	}

	.page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	fieldset {
		border-radius: 8px;
		padding: 8px;
		border: 2px solid var(--component-border);
	}
</style>

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

let newUsername: HTMLInputElement;
let tfaCode: HTMLInputElement;
let authCode: HTMLInputElement;

let io: Socket;
let qrcode: string;

onMount(() => io = initSocket($JWT!));

function changeUsername(e: SubmitEvent) {
	e.preventDefault()
	
	if (newUsername.value)
	{
		io.emit('changeDisplayName', {newDisplayName : newUsername.value}, function(answer: any) {
			console.log(answer);
			if ("error" in answer)
				return console.log("error: %s", answer.error);
			$displayName = newUsername.value;
			newUsername.value = '';
		})
	}

}

function logOut() {
	$JWT = null;
}

//this is how you get a qrcode as svg
function getQrCode(e: SubmitEvent) {
	e.preventDefault()

	io.emit('getQrCode', {}, function(e:any) {
		console.log(e)
		$JWT = e["token"]
		qrcode = e["qrcode"]
	})
}

//this is how you check a code
function checkCode(e: SubmitEvent) {
	e.preventDefault()

	io.emit('checkCode', {tfaCode: authCode.value}, function(answer: any) {
		console.log(answer);
	})
}

function disabletfa(e: SubmitEvent) {
	e.preventDefault()

}

//this is how you enable 2fa
function enableTfa(e: SubmitEvent) {
	e.preventDefault()

	io.emit('enableTfaAuth', {tfaCode: tfaCode.value}, function(answer:any) {
		if ("error" in answer)
			return console.log("error: %s", answer.error);
		$JWT = answer["token"]
		console.log(answer)
	})
}

</script>

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
		border: 2px solid;
		border-color: var(--component-border-color); 
	}
</style>

<!-- HTML -->

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Change your user settings" />
</svelte:head>

<div class="page">
	<Container style="flex: 1;">
		<form on:submit={(e) => { changeUsername(e); }}>
			<fieldset>
				<legend>User Data</legend>
				<div>
					<label>Username:</label>
					<input type="text" bind:this={newUsername} placeholder={$displayName}/>
				</div>
				<br/>
				<Button type="submit">Change username</Button>
			</fieldset>
		</form>

		<form on:submit={(e) => { checkCode(e)}}>
			<fieldset>
				<legend>Authentication</legend>

				<div>
					<label htmlFor="token">Please enter the code you were sent:</label>
					<input
						type="text"
						name="token"
						id="token"
						inputMode="numeric"
						pattern="[0-9]*"
						autoComplete="one-time-code"
						bind:this={authCode}
					/>
				</div>

				<Button type="submit">Submit</Button>
			</fieldset>
		</form>

		<form>
			<fieldset>
				<Button type="submit" on:click={logOut}>Log out</Button>
			</fieldset>
		</form>

		<form on:submit={(e) => { getQrCode(e); }}>
			<fieldset>
				<Button type="submit">getQrCode</Button>
			</fieldset>
		</form>

		<form on:submit={(e) => { enableTfa(e); }}>
			<fieldset>
				<div>
					<label>2faCode:</label>
					<input type="text" bind:this={tfaCode}/>
				</div>
				<br/>
				<Button type="submit">enableTfa</Button>
			</fieldset>
		</form>

		<img id="qr" src={qrcode}/>

	</Container>
</div>

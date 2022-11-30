<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import Disable2FaModal from "$lib/Components/Modal/Disable2FAModal.svelte";
import Enable2FaModal from "$lib/Components/Modal/Enable2FAModal.svelte";
import { initSocket } from "$lib/socketIO";
import { displayName, JWT } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { onMount } from "svelte";

let io: Socket;
let show2FAModal: boolean = false;
let showDis2FAModal: boolean = false;


// TODO: Check if the user has tfa enabled.
let tfaEnabled: boolean = false;
let newUsername: HTMLInputElement;
let authCode: HTMLInputElement;

onMount(() => {
	io = initSocket($JWT!)
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

</script>

<!-- HTML -->

<svelte:head>
	<title>Settings</title>
	<meta name="description" content="Change your user settings" />
</svelte:head>

<Enable2FaModal bind:visible={show2FAModal} bind:tfaEnabled={tfaEnabled}/>
<Disable2FaModal bind:visible={showDis2FAModal} bind:tfaEnabled={tfaEnabled}/>

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
				{#if tfaEnabled}
					<Button on:click={() => { showDis2FAModal = true }} >
						Disable 2FA
					</Button>
				{:else}
					<Button on:click={() => { show2FAModal = true }} >
						Enable 2FA
					</Button>
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
		border-radius: var(--border-radius);
		padding: 8px; 
		border: 2px solid var(--component-border);
	}
</style>

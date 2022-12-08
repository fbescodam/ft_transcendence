<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import Disable2FaModal from "$lib/Components/Modal/Disable2FAModal.svelte";
import Enable2FaModal from "$lib/Components/Modal/Enable2FAModal.svelte";
import { destroySocket, initSocket } from "$lib/socketIO";
import { displayName, JWT } from "$lib/Stores/User";
import NProgress from "nprogress";
import type { Socket } from "socket.io-client";
import { onDestroy, onMount } from "svelte";

let io: Socket;
let show2FAModal: boolean = false;
let showDis2FAModal: boolean = false;


let tfaEnabled: boolean = false;
let newUsername: HTMLInputElement;
let authCode: HTMLInputElement;
let newAvatar: HTMLInputElement;

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)
	io.emit("isTfaEnabled", {}, (data: { tfaEnabled: boolean }) => {
		if ("error" in data) {
			alert(data.error);
			return;
		}

		tfaEnabled = data.tfaEnabled;
		console.log(tfaEnabled);
	});
});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

/**
 * Change the name of the user
 * @param e The submit event
 */
function changeUsername(e: SubmitEvent) {
	e.preventDefault()

	const name = newUsername.value.substring(0, 42);
	io.emit('changeDisplayName', {newDisplayName : name}, function(answer: any) {
		if ("error" in answer) {
			alert("Failed to change username: " + answer.error);
			return;
		}

		$displayName = name;
		$JWT = answer["token"]
		newUsername.value = '';
		alert("Username changed");
	})
}

/**
 * Change the name of the user
 * @param e The submit event
 */
 function changeUserAvatar(e: Event) {
	console.log("changeUserAvatar", newAvatar, newAvatar.files);

	if (!newAvatar.files || newAvatar.files.length == 0) {
		alert("No file selected");
		return;
	}

	NProgress.start();
	const formData = new FormData()
	formData.append('file', newAvatar.files![0])

	fetch(`${$page.url.protocol}//${$page.url.hostname}:3000/avatar`, {
		method: 'POST',
		headers: {"Authorization": `Bearer ${$JWT!}`},
		body: formData
	}).catch((err) => alert(err)).then
	(() => {
		newAvatar.files = null;
		newAvatar.value = "";
	}).finally(() => NProgress.done());
}

function logOut() {
	$JWT = null;
}

//this is how you check a code
function checkCode(e: SubmitEvent) {
	e.preventDefault()

	io.emit('enableTfaAuth', {tfaCode: authCode.value}, function(answer:any) {
		if ("error" in answer) {
			alert("Failed to enable tfa: " + answer.error);
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
	<link rel='stylesheet' href='/nprogress.css'/>
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
		<form on:submit={(e) => { changeUsername(e); }}>
			<fieldset>
				<legend>Name</legend>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label>Username:</label>
				<input type="text" bind:this={newUsername} placeholder={$displayName} required/>
				<hr/>
				<Button type="submit">Submit</Button>
			</fieldset>
		</form>

		<fieldset>
			<legend>Avatar</legend>
			<input type="file" accept="image/*" required bind:this={newAvatar}/>
			<hr/>
			<Button on:click={(e) => { changeUserAvatar(e); }}>Submit</Button>
		</fieldset>

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

<!-- Scripting -->

<script context="module" lang="ts">
import { page } from '$app/stores';
import { onMount, onDestroy } from "svelte";
import { authSocket, initSocket, destroySocket } from '$lib/socketIO';
import { goto } from "$app/navigation";
import Button from "$lib/Components/Button/Button.svelte";
import { state, JWT, displayName, intraName, avatar } from "$lib/Stores/User";
import { PUBLIC_INTRA_APP_ID } from "$env/static/public";
import { generateRandomString } from "$lib/Utils/Basic";
import Logo42 from "$lib/Assets/42Logo.svg";
import Logo from "$lib/Assets/Logo.gif";
import Container from "$lib/Components/Container/Container.svelte";
import type { Socket } from 'socket.io-client';
import TextInput from '$lib/Components/TextInput/TextInput.svelte';
</script>

<script lang="ts">
$state = $state == "empty" ? generateRandomString(32) : $state;
let authCode = $page.url.searchParams.get("code");
let stateMismatch = $page.url.searchParams.get("state") == $state;
let hasTFA: boolean = false;
let tfaCodeField: HTMLInputElement;
let jwt: string;
let io: Socket;

//====//

//TODO: authguard on every page
onMount(() => {
	if (authCode != null && !stateMismatch) {
		io = authSocket($page.url.hostname)

		// send authentication code to backend
		io.emit("authStart", { authCode: authCode, state: $state, redirectUrl: `${$page.url.origin}${$page.url.pathname}` },  function (answer: any) {
			if ("error" in answer) {
				console.error(answer.error, answer);
				alert(`Error: ${answer.error}`);
			}

			$displayName = answer.displayName;
			$intraName = answer.intraName;
			$avatar = answer.avatar;
			hasTFA = answer.hasTfa;

			jwt = answer.token
			if (!hasTFA) {
				$JWT = answer.token;
				goto(`${$page.url.origin}/`, { replaceState: true })
			}
		});

	}
});

function checkCode(e: SubmitEvent) {
	e.preventDefault();

	if (io)
		destroySocket(io);

	io = initSocket($page.url.hostname, jwt)

	io.emit("checkCode", { authCode: tfaCodeField.value }, (answer: any) => {
		if ("error" in answer) {
			alert("Wrong code bitch");
			return;
		}
		$JWT = jwt

		goto('http://localhost:5173', { replaceState: true })
	});
}

//====//

function onClick() {
	const params = new URLSearchParams({
		client_id: PUBLIC_INTRA_APP_ID,
		redirect_uri: window.location.origin + window.location.pathname,
		response_type: "code",
		scope: "public",
		state: $state
	});

	goto(`https://api.intra.42.fr/oauth/authorize?${params.toString()}`, {
		replaceState: true
	});
}

onDestroy(() => {
	if (io)
		destroySocket(io);
});

</script>

<!-- HTML -->

<div class="page">
	<Container style="flex: 1; margin: 1rem;">
		<div class="center">
			<img class="freek" src={Logo} alt="42-logo" height="256" width="256"/>
			{#if !authCode }
				<h1>Welcome to Breadpong!</h1>
				<Button on:click={onClick}>
					<div class="login-button">
						<b>Login</b>
						<img src={Logo42} alt="42-logo" height="32" width="32"/>
					</div>
				</Button>
			{:else if hasTFA}
				<h1>Enter your 2FA code</h1>
				<form style="display: flex; gap: 8px;" on:submit={(e) => checkCode(e)}>
					<input type="text" placeholder="1234567" pattern="[0-9]*" bind:this={tfaCodeField} inputmode="numeric" required/>
					<Button type="submit">Send</Button>
				</form>
			{:else if !stateMismatch }
				<h1>Logging in...</h1>
			{:else}
				<h1>Error: state mismatch!</h1>
				<p>Someone might be trying to do someting nasty.</p>
			{/if}
		</div>
	</Container>
</div>

<!-- Styling -->

<style lang="scss">
	.page {
		display: flex;
		height: 100vh;

		& .center {
			display: flex;
			height: 100%;
			gap: 18px;

			flex-direction: column;
			align-items: center;
			justify-content: center;
		}

		& .login-button {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: large;
		}

		& .freek {
			clip-path: circle(50%);
			animation-name: spin;
			animation-duration: 6000ms;
			animation-iteration-count: infinite;
			animation-timing-function: linear;

			@keyframes spin {
				to {
					transform:rotate(0deg);
				}
				from {
					transform:rotate(360deg);
				}
			}
		}
	}
</style>

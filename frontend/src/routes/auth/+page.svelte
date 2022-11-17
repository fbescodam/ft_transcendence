<!-- Scripting -->

<script context="module" lang="ts">
import { page } from '$app/stores';
import { onMount } from "svelte";
import { io } from "$lib/socketIO";
import { goto } from "$app/navigation";
import { Socket } from "socket.io-client";
import Button from "$lib/Components/Button/Button.svelte";
import { state, user, loggedIn } from "$lib/Stores/User";
import { PUBLIC_INTRA_APP_ID } from "$env/static/public";
import { generateRandomString } from "$lib/Utils/Basic";
</script>

<script lang="ts">
$state = $state == "empty" ? generateRandomString(32) : $state;
let authCode = $page.url.searchParams.get("code");
let stateMismatch = $page.url.searchParams.get("state") == $state;

//====//

onMount(() => {
	if (authCode != null && !stateMismatch) {
		console.log(authCode);

		
		// send authentication code to backend
		io.emit("authStart", { authCode: authCode, state: $state },  function (answer: any) {
			console.log(answer); //this is jwt, on profile we return to the /auth page
			$user.jwtToken = answer.token
			goto('http://localhost:5173')
		});
	}
});

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

</script>

<!-- HTML -->

{#if ! $loggedIn && !authCode }
	<Button on:click={onClick}>
		Connect with 42 Intranet
	</Button>
{:else if ! stateMismatch }
	<h1>Logging you in...</h1>
{:else}
	<h1>Error: state mismatch!</h1>
	<p>Someone might be trying to do someting nasty.</p>
{/if}

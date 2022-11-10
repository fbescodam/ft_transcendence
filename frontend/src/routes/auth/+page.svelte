<script lang="ts">
import Button from "$lib/Components/Button/Button.svelte";
import { state, user, loggedIn } from "$lib/Stores/User";
import { PUBLIC_INTRA_APP_ID } from "$env/static/public";
import { generateRandomString } from "$lib/Utils/Basic";
import { page } from '$app/stores';
import { onMount } from "svelte";
import { io } from "$lib/socketIO";

if ($state == "empty") {
	$state = generateRandomString(32);
}

function onClick() {
	window.location.replace("https://api.intra.42.fr/oauth/authorize?client_id="
		+ PUBLIC_INTRA_APP_ID +
		"&redirect_uri=" +
		encodeURIComponent(window.location.origin + window.location.pathname)
		+ "&response_type=code&scope=public&state=" +
		$state
	);
}

let authCode: string | null = $page.url.searchParams.get("code");
let stateMismatch = $page.url.searchParams.get("state") == $state;

onMount(() => {
	if (authCode != null && !stateMismatch) {
		console.log(authCode);
		// on retrieval of a session token, we have logged in
		io.on("authEnd", (token: string) => {
			console.log(token);
		});

		// send authentication code to backend
		io.emit("authStart", { authCode: authCode, state: $state });
	}
});
</script>

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

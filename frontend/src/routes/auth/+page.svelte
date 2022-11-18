<!-- Scripting -->

<script context="module" lang="ts">
import { page } from '$app/stores';
import { onMount } from "svelte";
import { authSocket } from '$lib/socketIO';
import { goto } from "$app/navigation";
import Button from "$lib/Components/Button/Button.svelte";
import { state, JWT, user } from "$lib/Stores/User";
import { PUBLIC_INTRA_APP_ID } from "$env/static/public";
import { generateRandomString } from "$lib/Utils/Basic";
import Logo42 from "$lib/Assets/42Logo.svg";
import Logo from "$lib/Assets/Logo.gif";
import Container from "$lib/Components/Container/Container.svelte";
</script>

<script lang="ts">
$state = $state == "empty" ? generateRandomString(32) : $state;
let authCode = $page.url.searchParams.get("code");
let stateMismatch = $page.url.searchParams.get("state") == $state;

//====//

//TODO: authguard on every page
onMount(() => {
	if (authCode != null && !stateMismatch) {
		const io = authSocket()

		// send authentication code to backend
		io.emit("authStart", { authCode: authCode, state: $state },  function (answer: any) {
			$JWT = answer.token;
			$user = answer.displayName;
			goto('http://localhost:5173', { replaceState: true })
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

{#if !authCode }
<div class="page">
	<Container style="flex: 1; margin: 1rem;">
		<div class="center">
			<img class="freek" src={Logo} alt="42-logo" height="256" width="256"/>
			<h1>Welcome to Breadpong!</h1>
			<Button on:click={onClick}>
				<div class="login-button">
					<b>Login</b>
					<img src={Logo42} alt="42-logo" height="32" width="32"/>
				</div>
			</Button>
		</div>
	</Container>
</div>
{:else if ! stateMismatch }
	<h1>Logging you in...</h1>
{:else}
	<h1>Error: state mismatch!</h1>
	<p>Someone might be trying to do someting nasty.</p>
{/if}

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
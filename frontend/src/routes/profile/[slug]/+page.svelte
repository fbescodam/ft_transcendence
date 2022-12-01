<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<!-- // io.on("sendMsg", function (message: any) { // Listen to the message event
// 		if (message.channel == openChannel)
// 			messages = [...messages, { senderName: message.user, text: message.text}]
// }) -->

<script lang="ts">
import Container from "$lib/Components/Container/Container.svelte";
import { displayName, JWT } from "$lib/Stores/User";
import { page } from "$app/stores";
import { onMount } from "svelte";
import ProfilePic from "$lib/Components/Profile/ProfilePic.svelte";
import ProfileStats from "$lib/Components/Profile/ProfileStats.svelte";
import type { Socket } from "socket.io-client";
import { initSocket } from "$lib/socketIO";
import type { User } from "$lib/Types";
import { goto } from "$app/navigation";
import MatchScore from "$lib/Components/MatchScore/MatchScore.svelte";
import ProfileFriend from "$lib/Components/Profile/ProfileFriend.svelte";

let socket: Socket;
let user: User | null = null;

onMount(() => {
	socket = initSocket($page.url.hostname, $JWT!);
	console.log($page.params.slug)
	socket.emit("getUserData", {penis: $page.params.slug }, function (data: any) {
		if ("error" in data) {
			// Disgusting hack because I can't read.
			goto("/profile", { replaceState: true });
			return;
		}

		user = data;
	});
});

const getRandomEmoji = () => {
	const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🤡','😉'];
	return emojis[~~(Math.random() * emojis.length)]
}

</script>

<!-- HTML -->

<svelte:head>
	<title>Home</title>
	<meta name="description" content="View your profile page" />
</svelte:head>

{#if user}
	<div>
		{#if $page.params.slug === $displayName}
			<Container style="flex: 1; height: 95%;">
				<h1>Welcome back {$displayName} {getRandomEmoji()}</h1>
			</Container>
			<hr />
		{/if}
		<Container style="background-image: url(https://cdn.intra.42.fr/coalition/cover/59/Cetus_small.jpg); background-repeat: no-repeat; background-size: cover; background-position: center;">
			<div class="profile-stats">
				<ProfilePic avatar={user.avatar} width={128} height={128}/>
				<ProfileStats name={user.name} wins={user.wins} loss={user.loss} games={user.games.length} />
			</div>
		</Container>
		<hr />
		<div class="content">
			<details>
				<summary>
					<span>Matches</span>
				</summary>
				{#if user.games.length > 0}
					{#each user.games as game}
						<MatchScore p1Avatar={game.players[0].avatar} p2Avatar={game.players[1].avatar} score={{p1: game.victorScore, p2: game.loserScore}}/>
					{/each}
				{:else}
					<Container>
						<p>No matches found.</p>
					</Container>
				{/if}
			</details>

			<details>
				<summary>
					<span>Friends</span>
				</summary>
				{#if user.friends.length > 0}
					<div class="friends-list">
						{#each user.friends as friend}
							<ProfileFriend user={friend} />
						{/each}
					</div>
				{:else}
					<Container>
						<p>User has no friends, big sad.</p>
					</Container>
				{/if}
			</details>
		</div>
	</div>
{:else}
<h1>Loading ...</h1>
{/if}


<!-- Styling -->

<style lang="scss">

.profile-stats {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
    justify-content: center;
	gap: 15px;
}

.friends {
	display: inline-flex;
	overflow-x: auto;
	max-width: 100%;
	gap: 5px;
}

.content {
	display: grid;
	gap: 8px;
	grid-template-columns: 1fr 1fr;
	max-height: 20px;
	padding-bottom: 1rem;

	.match-history {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.friends-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	summary {
		user-select: none;
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 8px;
		border: 1px var(--component-border) solid;
		background-color: var(--component-background);
		box-shadow: 10px 20px 30px -20px rgba(0, 0, 0, 0.30);
	}
}

</style>

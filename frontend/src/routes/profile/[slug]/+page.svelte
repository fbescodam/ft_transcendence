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
import Button from "$lib/Components/Button/Button.svelte";
import Container from "$lib/Components/Container/Container.svelte";
import { displayName, avatar, JWT } from "$lib/Stores/User";
import { page } from "$app/stores";
import { onMount } from "svelte";
import ProfilePic from "$lib/Components/Profile/ProfilePic.svelte";
import ProfileStats from "$lib/Components/Profile/ProfileStats.svelte";
import MatchScore from "$lib/Components/MatchScore/MatchScore.svelte";
import ProfileFriend from "$lib/Components/Profile/ProfileFriend.svelte";
import type { Socket } from "socket.io-client";
import { initSocket } from "$lib/socketIO";

let socket: Socket;

onMount(() => {
	socket = initSocket($JWT!);
	socket.emit("user", {user: $page.params.slug}, (answer: any) => {
		
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

<div>
	{#if $page.params.slug === $displayName}
		<Container style="flex: 1; height: 95%;">
			<h1>Welcome back {$displayName} {getRandomEmoji()}</h1>
		</Container>
		<hr />
	{/if}
	<Container style="background-image: url(https://cdn.intra.42.fr/coalition/cover/59/Cetus_small.jpg); background-repeat: no-repeat; background-size: cover; background-position: center;">
		<div class="profile-stats">
			<ProfilePic userID={$avatar} width={128} height={128}/>
			<ProfileStats />
		</div>
	</Container>
	<hr />
	<div class="content">
		<details>
			<summary>
				<span>Matches</span>
			</summary>
			<div class="match-history">
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
				<MatchScore p1UserID={$avatar} p2UserID={$avatar} score={{p1: 9, p2: 0}}/>
			</div>
		</details>

		<details>
			<summary>
				<span>Friends</span>
			</summary>
			<div class="friends-list">
				<ProfileFriend userID={$avatar} />
				<ProfileFriend userID={$avatar} />
				<ProfileFriend userID={$avatar} />
				<ProfileFriend userID={$avatar} />
				<ProfileFriend userID={$avatar} />
				<ProfileFriend userID={$avatar} />
				<ProfileFriend userID={$avatar} />
			</div>
		</details>
	</div>
</div>

<!-- Styling -->

<style lang="scss">

.profile-stats {
	display: flex;
	flex-wrap: wrap;
	align-items: stretch;
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
	
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
import { onMount, onDestroy } from "svelte";
import ProfilePic from "$lib/Components/Profile/ProfilePic.svelte";
import ProfileStats from "$lib/Components/Profile/ProfileStats.svelte";
import { initSocket, destroySocket } from "$lib/socketIO";
import type { User } from "$lib/Types";
import { goto } from "$app/navigation";
import MatchScore from "$lib/Components/MatchScore/MatchScore.svelte";
import ProfileFriend from "$lib/Components/Profile/ProfileFriend.svelte";
import Button from "$lib/Components/Button/Button.svelte";
import DirectMessageBox from "$lib/Components/DirectMessageBox/DirectMessageBox.svelte";
import type { Socket } from "socket.io-client";

let io: Socket;
let user: User | null = null;
let isCurrentUser: boolean = false;
let isFriend: boolean = false;
let isBlocked: boolean = false;
let isBlockReceive: boolean = false;

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!);
	console.log($page.params.slug)
	console.log($displayName)
	io.emit("getUserData", {penis: $page.params.slug }, function (data: any) {
		if ("error" in data) {
			// Disgusting hack because I can't read.
			goto("/profile", { replaceState: true });
			return;
		}

		user = data;
		console.log(user)
		if (user!.name == $displayName)
			isCurrentUser = true;
		if (isCurrentUser == false && user!.friends.map((item) => item['name']).includes($displayName!))
			isFriend = true;
		if (isBlocked == false && user!.blocked.map((item) => item['name']).includes($displayName!))
			isBlocked = true;
		if (isBlockReceive == false && user!.blockedWho.includes($displayName!))
			isBlockReceive = true;

	});
});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

// Add user as a retard
function addUser() {
	if (!isFriend) {
		io.emit("addFriend",{newFriend:user!.intraName}, function (e:any) {
			console.log(e)
		})
	}
	else {
		io.emit("removeFriend", {removeFriend: user!.intraName}, function (e:any) {
			console.log(e)
		})
	}
	window.location.reload()
	console.log("Add or unadd user as a friend");
}

// Invite that retard
function inviteUser() {
	console.log("invite user to game");
}

// Shield from that retards autism
function blockUser() {
	if (!isBlocked) {
		io.emit("blockUser",{blockUser:user!.intraName}, function (e:any) {
			console.log(e)
		})
	}
	else {
		io.emit("unBlockUser", {unBlockUser: user!.intraName}, function (e:any) {
			console.log(e)
		})
	}
	window.location.reload()
	console.log("block or unblock user to game");
}

const getRandomEmoji = () => {
	const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🤡','😉'];
	return emojis[~~(Math.random() * emojis.length)]
}

function spectateUser() {
	console.log("Trying to spectate user...");
	// Shit user to that lobby 
}

</script>

<!-- HTML -->

<svelte:head>
	<title>Home</title>
	<meta name="description" content="View your profile page" />
</svelte:head>

{#if user}
	<div>
		{#if user && isCurrentUser}
			<Container style="flex: 1; height: 95%;">
				<h1>Welcome back {$displayName} {getRandomEmoji()}</h1>
			</Container>
			<hr />
		{/if}
		<Container style="background-image: url(https://cdn.intra.42.fr/coalition/cover/59/Cetus_small.jpg); background-repeat: no-repeat; background-size: cover; background-position: center;">
			<div class="profile-stats">
				<ProfilePic avatar={user.avatar} width={128} height={128}/>
				<ProfileStats name={user.name} wins={user.wins} loss={user.losses} games={user.games.length} status={user.status} />
			</div>
			{#if $page.params.slug != $displayName && isBlockReceive == false}
			<div style="margin-top: 8px;">
				<Button on:click={() => addUser()}>
					{#if isFriend}
						Remove Friend
					{:else}
						Add Friend
					{/if}
				</Button>
				<Button on:click={() => inviteUser()}>Invite</Button>
				<Button on:click={() => spectateUser()}>Spectate</Button>
				<Button on:click={() => blockUser()}>
					{#if isBlocked}
						Unblock
					{:else}
						Block
					{/if}
				</Button>
			</div>
			{/if}
		</Container>
		<hr />
		{#if isCurrentUser == false && isBlocked == false}
			<div style="position: absolute; bottom: 10px; right: 10px;">
				<DirectMessageBox otherUser={user.intraName}/>
			</div>
		{/if}
		<div class="content">
			<details>
				<summary>
					<span>Matches</span>
				</summary>
				{#if user.games.length > 0}
					{#each user.games as game}
						{#if game.players != undefined}
							{#if game.players.length > 1 && game.status == "ENDED"}
								<MatchScore p1Avatar={game.players[0].avatar} p2Avatar={game.players[1].avatar} score={{p1: game.victorScore, p2: game.loserScore}}/>
							{:else}
								<p><b>The game here has no players... What?</b></p>
							{/if}
						{:else}
							<p><b>Yo Leon fix this, game is undefined</b></p>
						{/if}
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
							<ProfileFriend io={io} profile={friend} />
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
	backdrop-filter: blur(4px);
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
		border-radius: var(--border-radius);
		border: 1px var(--component-border) solid;
		background-color: var(--component-background);
		box-shadow: 10px 20px 30px -20px rgba(0, 0, 0, 0.30);
	}
}

</style>

<!-- Scripting -->

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
let isInGame: number = -1;
let status: string;

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!);
	console.log($page.params.slug)
	console.log($displayName)
	io.emit("getUserData", {u: $page.params.slug }, function (data: any) {
		console.log("getUserData:", data);
		if ("error" in data) {
			// Disgusting hack because I can't read.
			goto("/profile", { replaceState: true });
			return;
		}

		user = data.user;
		status = data.online ? "ONLINE" : "OFFLINE";
		if (user!.name == $displayName)
			isCurrentUser = true;
		if (isCurrentUser == false && user!.friends.map((item) => item['name']).includes($displayName!))
			isFriend = true;
		if (isBlocked == false && user!.blocked.map((item) => item['name']).includes($displayName!))
			isBlocked = true;
		if (isBlockReceive == false && user!.blockedWho.includes($displayName!))
			isBlockReceive = true;

		io.emit("userInGame", { userIntraName: user?.intraName }, (ret: any) => {
			console.log("User in game status:", ret);
			if ("error" in ret)
				console.error(ret["error"]);
			else if (ret.status === "gaming" && "game" in ret && "id" in ret.game) {
				isInGame = ret.game.id;
				status = "HAVING A GAMER MOMENT"
			}
		});
	});
});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

function addUser() {
	if (!isFriend) {
		io.emit("addFriend",{newFriend:user!.intraName}, function (e:any) {
			console.log(e);
			window.location.reload();
		})
	}
	else {
		io.emit("removeFriend", {removeFriend: user!.intraName}, function (e:any) {
			console.log(e);
			window.location.reload();
		})
	}
}

function inviteUser() {
	console.log(user?.intraName)
	if (isInGame > -1)
	{
		alert("user is in a game already");
		return;
	}
	io.emit("inviteToGame", {userIntraName:user?.intraName}, function (answer:any) {
		if ("error" in answer) {
			alert(answer.error);
			return;
		}
		console.log("invited")
	})
}

function blockUser() {
	if (!isBlocked) {
		io.emit("blockUser",{blockUser:user!.intraName}, function (e:any) {
			console.log(e);
			window.location.reload();
		})
	}
	else {
		io.emit("unBlockUser", {unBlockUser: user!.intraName}, function (e:any) {
			console.log(e);
			window.location.reload();
		})
	}
}

const getRandomEmoji = () => {
	const emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🤡','😉'];
	return emojis[~~(Math.random() * emojis.length)]
}

function spectateUser() {
	console.log("Trying to spectate user...");
	goto("/game/" + isInGame, { replaceState: false });
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
		<Container style="background-image: url(https://picsum.photos/1920/1080); background-repeat: no-repeat; background-size: cover; background-position: center;">
			<div class="profile-stats">
				<ProfilePic avatar={user.avatar} width={128} height={128} alt={user.intraName} />
				<ProfileStats name={user.name} wins={user.wins} loss={user.losses} games={user.games.length} {status} />
			</div>
			{#if $page.params.slug != $displayName && isBlockReceive == false && isCurrentUser == false}
			<div style="margin-top: 8px;">
				<Button on:click={() => addUser()}>
					{#if isFriend}
						Remove Friend
					{:else}
						Add Friend
					{/if}
				</Button>
				<Button on:click={() => inviteUser()}>Invite</Button>
				{#if isInGame > -1}
				<Button on:click={() => spectateUser()}>Spectate</Button>
				{/if}
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
			<DirectMessageBox otherUser={user.intraName}/>
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
								<MatchScore p1Avatar={game.players[0].avatar} p2Avatar={game.players[1].avatar} score={(game.winnerId == game.players[0].id ? {p1: game.victorScore, p2: game.loserScore} : {p1: game.loserScore, p2: game.victorScore})} winner={game.winnerId == game.players[0].id ? "p1" : "p2"} />
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
	background: rgba(0, 0, 0, 0.1);
	border-radius: var(--border-radius);
	text-shadow:rgba(0, 0, 0, 0.60) 0px 0px 8px;
	gap: 15px;
	padding: 16px;
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

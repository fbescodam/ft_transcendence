<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";
import Button from "../Button/Button.svelte";
import ProfilePic from "./ProfilePic.svelte";
import { ChatAlt2, EmojiHappy, EmojiSad, Icon, X } from "svelte-hero-icons";
import Container from "../Container/Container.svelte";

// TODO: Actually do the thing

export let userID: string | null;
</script>

<!-- HTML -->

<Container>
	<b>User</b>
	<div class="content">
		<div class="user-info">
			<ProfilePic height={50} width={50} userID={userID}/>
		</div>
		<menu>
			<Button on:click={() => { }}>
				<Icon src={ChatAlt2} size={"1.4rem"} />
				<span>Message</span>
			</Button>
			<Button on:click={() => { }}>
				<Icon src={EmojiHappy} size={"1.4rem"} />
				<span>Invite</span>
			</Button>
			<Button on:click={() => { }}>
				<Icon src={EmojiSad} size={"1.4rem"} />
				<span>Block</span>
			</Button>
			<Button on:click={() => { }}>
				<Icon src={X} size={"1.4rem"} />
				<span>Remove</span>
			</Button>
		</menu>
	</div>
</Container>

<!-- Styling -->

<style lang="scss">
.content {
	display: flex;
	flex-direction: row;
	gap: 4px;
	
	.user-info {
		flex: 1;
		display: block;
	}

	& menu {
		display: flex;
		gap: 8px;
		flex-direction: row;
	}
}
</style>
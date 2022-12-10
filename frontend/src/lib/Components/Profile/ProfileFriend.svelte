<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import Button from "../Button/Button.svelte";
import ProfilePic from "./ProfilePic.svelte";
import { ChatAlt2, EmojiHappy, Icon, UserCircle, X } from "svelte-hero-icons";
import Container from "../Container/Container.svelte";
import type { User } from "$lib/Types";
import type { Socket } from "socket.io-client";
import { page } from "$app/stores";
import { displayName } from "$lib/Stores/User";
import { goto } from "$app/navigation";

export let io: Socket;
export let profile: User;

</script>

<!-- HTML -->

<Container>
	<!-- svelte-ignore a11y-missing-attribute TODO: clicking on this doesnt take you to a profile-->
	<a rel="external" target="_self" class="profile-link" href="/profile/{profile.intraName}" title={profile.name} >
		<ProfilePic height={50} width={50} avatar={profile.avatar} alt={profile.intraName} />
	</a>
	<p>{profile.name}</p>
</Container>

<!-- Styling -->

<style lang="scss">
.profile-link {
	display: inline-block;
	text-decoration: none;
	cursor: pointer;
}
</style>

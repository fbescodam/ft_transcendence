
<!-- Scripting -->

<script lang="ts">
import { page } from '$app/stores';
import { destroySocket, initSocket } from "$lib/socketIO";
import { JWT } from "$lib/Stores/User";
import type { User } from "$lib/Types";
import type { Socket } from "socket.io-client";
import { onDestroy, onMount } from "svelte";
import Button from "../Button/Button.svelte";
import Modal from "./Modal.svelte";

//= Properties =//

/** Should the modal be visible */
export let visible: boolean = false;
export let channel: any;

//= Variables =//

let io: Socket;
let users: User[] = [];
let passwordInput: HTMLInputElement;
let userInput: HTMLInputElement;
let killSelect: HTMLSelectElement;
let killSelection: string = "none";

//= Methods =//

onMount(() => {
	io = initSocket($page.url.hostname, $JWT!)

});

onDestroy(() => {
	if (io)
		destroySocket(io);
});

function onCancel() {
	visible = false;
}

function passwordSetting(e: SubmitEvent) {
	e.preventDefault();

	console.log(passwordInput.value)
	io.emit("changePassword", { password: passwordInput.value, name: channel.channelName}, function (e:any) {
		if ("error" in e) {
			alert(e.error);
			return;
		}
		alert("Password changed");
	})
}


function killUser(e: SubmitEvent) {
	e.preventDefault();

	switch (killSelect.value) {
		case "1": {
			io.emit("muteUser", { muteUser: userInput.value, channelName: channel.channelName }, function (e:any) {
				if ("error" in e) {
					alert(e.error);
					return;
				}
				alert(`User ${userInput.value} has been muted`);
			})
			break;
		}

		case "2": {
			io.emit("kickUser", { kickUser: userInput.value, channelName: channel.channelName }, function (e:any) {
				if ("error" in e) {
					alert(e.error);
					return;
				}
				alert(`User ${userInput.value} has been banned`);
			})
			break;
		}

		case "3": {
			io.emit("unMuteUser", { muteUser: userInput.value, channelName: channel.channelName }, function (e:any) {
				if ("error" in e) {
					alert(e.error);
					return;
				}
				alert(`User ${userInput.value} has been unmuted`);
			})
			break;
		}

		case "4": {
			io.emit("makeUserAdmin", { adminUser: userInput.value, channelName: channel.channelName }, function (e:any) {
				if ("error" in e) {
					alert(e.error);
					return;
				}
				alert(`User ${userInput.value} has been made admin`);
			})
			break;
		}

		default:
			alert(`Lol no? ${userInput.value}`);
			break;
	}
}

function removePW() {
	io.emit("removePassword", {name:channel.channelName}, function (e:any) {
		if ("error" in e) {
			alert(e.error);
			return;
		}
		alert("Password removed");
	})
}


</script>

<!-- HTML -->

<Modal bind:visible={visible} style="display: flex; flex-direction: column;">
    <div style="display: flex; margin: 1rem 0; overflow: auto; gap: 10px">
		<form on:submit={(e) => { passwordSetting(e); }}>
			<fieldset>
				<legend>Password</legend>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label>Update Password:</label>
				<input type="password" bind:this={passwordInput} required/>
				<hr/>
				<Button type="submit">Submit</Button>
				<Button on:click={() => {removePW()}}>Remove password</Button>
			</fieldset>
		</form>
		<form on:submit={(e) => { killUser(e); }}>
			<fieldset>
				<legend>Kill Users</legend>

				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label>UserName:</label>
				<input type="text" bind:this={userInput} required/>
				<hr/>
				<select bind:this={killSelect} on:change={() => {
					killSelection = killSelect.value; console.log(killSelection)
				}}>
					<option selected value="1">Mute</option>
					<option value="2">Kick / Ban</option>
					<option value="3">Unmute</option>
					<option value="4">Make Admin</option>
				</select>
				<hr/>
				<Button type="submit">Submit</Button>
			</fieldset>
		</form>
    </div>
    <Button on:click={onCancel}>Cancel</Button>
</Modal>

<!-- Styling -->

<style lang="scss">
fieldset {
	border-radius: var(--border-radius);
	padding: 8px;
	border: 2px solid var(--component-border);
}
</style>


<!-- Scripting -->

<script lang="ts">
import { initSocket } from "$lib/socketIO";
import { page } from '$app/stores';
import { channels } from "$lib/Stores/Channel";
import { JWT } from "$lib/Stores/User";
import type { Socket } from "socket.io-client";
import { onMount } from "svelte";
import Button from "../Button/Button.svelte";
import Modal from "./Modal.svelte";

//= Properties =//

/** Should the modal be visible */
export let visible: boolean = false;

//= Variables =//

export let publicOrPrivate: boolean = false;
let channelNameInput: HTMLInputElement;
let channelPasswordInput: HTMLInputElement;
let isPublicChannelInput: HTMLInputElement;
let isPrivateChannelInput: HTMLInputElement;

let joinChannelNameInput: HTMLInputElement;
let joinChannelPasswordInput: HTMLInputElement;

let io: Socket;

//= Methods =//

onMount(() => io = initSocket($page.url.hostname, $JWT!));

/** Handler for closing the modal. */
function onCancel() {
    visible = false;
    channelNameInput.value = "";
}

/**
 * Handler for creating a new channel.
 * @param e The form submit event.
 */
function onChannelCreate(e: SubmitEvent) {
    e.preventDefault();
    let password = null

    if (channelPasswordInput)
        password = channelPasswordInput.value;

    io.emit('createChannel', {name:channelNameInput.value, password:password}, function (answer: any) {
        if (answer.error)
            console.log(answer.error)
        else
            $channels = [...$channels, {channelName: answer.name}]
    });
    visible = false;
}

/**
 * Handler for joining a new channel.
 * @param e The form submit event.
 */
function onChannelJoin(e: SubmitEvent) {
    e.preventDefault();

    io.emit('joinChannel', {name:joinChannelNameInput.value, password:joinChannelPasswordInput.value}, function (answer: any) {
        if (answer.error)
            console.log(answer.error)
        else
            $channels = [...$channels, {channelName: answer.name}]
    });

    visible = false;
}

</script>

<!-- HTML -->

<Modal bind:visible={visible} style="display: flex; flex-direction: column;">
    <div style="display: flex; justify-content: space-around; margin: 1rem 0;">
        <form on:submit={(e) => { onChannelCreate(e); }}>
            <h1>Create Channel</h1>
            <section class="form-body">
                <!-- Data -->
                <div class="form-content">

                    <!-- Channel Name -->
                    <label for="channel-name">
                        <b>Channel:</b>
                    </label>
                    <input bind:this={channelNameInput} id="channel-name" type="text" required>

                    <!-- Channel Type -->
                    <br/>
                    <section>
                        <label for="public">
                            <b>Public</b>
                        </label>
                        <input bind:this={isPublicChannelInput} type="radio" id="public" name="private" required bind:group={publicOrPrivate} value={false}>

                        <label for="private">
                            <b>Private</b>
                        </label>
                        <input bind:this={isPrivateChannelInput} type="radio" id="private" name="private" required bind:group={publicOrPrivate} value={true}>
                    </section>

                    <!-- Channel Password -->
                    <br/>
                    {#if publicOrPrivate}
                        <label for="password">
                            <b>Password:</b>
                        </label>
                        <input bind:this={channelPasswordInput} type="password" id="password" name="password" required>
                    {/if}
                </div>
            </section>

            <!-- Actions -->
            <Button type="submit">Add</Button>
        </form>

        <hr />

        <form on:submit={(e) => onChannelJoin(e)}>
            <h1>Join Channel</h1>
            <section class="form-body">
                <!-- Data -->
                <div class="form-content">

                    <!-- Channel Name -->
                    <label for="join-channel-name">
                        <b>Channel:</b>
                    </label>
                    <input bind:this={joinChannelNameInput} id="join-channel-name" type="text" required>

                    <!-- Channel Password -->
                    <br/>
                    <label for="join-password">
                        <b>Password:</b>
                    </label>
                    <input bind:this={joinChannelPasswordInput} type="password" id="join-password" name="password">
                </div>
            </section>
            <Button type="submit">Join</Button>
        </form>
    </div>
    <Button on:click={onCancel}>Cancel</Button>
</Modal>

<!-- Styling -->

<style lang="scss">
    .form-body {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1em;

        margin: 20px 0 0 0;

        & .form-content > * {
            margin: 10px 0;
            display: inline-block;
        }
    }
</style>


<!-- Scripting -->

<script lang="ts">
import { initSocket } from "$lib/socketIO";
import { channels } from "$lib/Stores/Channel";
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
let isPublicChannelInput: HTMLInputElement;
let isPrivateChannelInput: HTMLInputElement;
let channelPasswordInput: HTMLInputElement;
let io: Socket;

//= Methods =//

onMount(() => {
    io = initSocket();
});

function onCancel() {
    visible = false;
    channelNameInput.value = "";
}

function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    let password = null

    if (channelPasswordInput)
        password = channelPasswordInput.value;    

    io.emit('createChannel', {name:channelNameInput.value, password:password}, function (answer: any) {
        $channels = [...$channels, {channelName:answer.name}]
    });
    visible = false;
}

</script>

<!-- HTML -->

<Modal bind:visible={visible}>
    <form on:submit={(e) => { onSubmit(e); }}>
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

            <!-- Actions -->
            <div>
                <Button on:click={onCancel}>Cancel</Button>
                <Button type="submit">Add</Button>
            </div>
        </section>
    </form>
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

<!-- Scripting -->

<script lang="ts">
import Button from "../Button/Button.svelte";
import Modal from "./Modal.svelte";

//= Properties =//

/** Should the modal be visible */
export let visible: boolean = false;

//= Variables =//

let channelNameInput: HTMLInputElement;
let isPublicChannelInput: HTMLInputElement;
let isPrivateChannelInput: HTMLInputElement;
let channelPasswordInput: HTMLInputElement;

//= Methods =//

function onCancel() {
    visible = false;
    channelNameInput.value = "";
}

function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    console.log(channelNameInput.value);
}

</script>

<!-- HTML -->

<Modal bind:visible={visible}>
    <form on:submit={(e) => { onSubmit(e); }}>
        <h1>Add Channel</h1>
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
                    <input bind:this={isPublicChannelInput} type="radio" id="public" name="private" required>
    
                    <label for="private">
                        <b>Private</b>
                    </label>
                    <input bind:this={isPrivateChannelInput} type="radio" id="private" name="private" required>
                </section>

                <!-- Channel Password -->
                <!-- TODO: Is is private then show, else hide. -->
                <br/>
                <label for="password">
                    <b>Password:</b>
                </label>
                <input bind:this={channelPasswordInput} type="password" id="password" name="password" required>
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
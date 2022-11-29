<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";
import { Icon, Refresh } from "svelte-hero-icons"
import Container from "$lib/Components/Container/Container.svelte";
import { onDestroy, onMount } from "svelte";
import { goto } from "$app/navigation";
import { SINGLEPL_MODE_ID, LOCAL_MULTIPL_MODE_ID, ONLINE_MULTIPL_MODE_ID } from "$lib/Game/Modes";
import { JWT } from "$lib/Stores/User";
import { initSocket } from "$lib/socketIO";
import type { Socket } from "socket.io-client";

let userInQueue = false;
let io: Socket | null = null;

onMount(() => {
    io = initSocket($JWT!);
    const selectedModeParam = $page.url.searchParams.get('mode');

    if (selectedModeParam != null) {
        const selectedModeID = parseInt(selectedModeParam);
        switch (selectedModeID) {
            case SINGLEPL_MODE_ID: // Singleplayer
            {
                console.log("Creating singleplayer lobby");
                goto("/game/singleplayer", { replaceState: true });
                break;
            }
            case LOCAL_MULTIPL_MODE_ID: // Local Multiplayer
            {
                console.log("Creating local multiplayer lobby");
                goto("/game/local-multiplayer", { replaceState: true });
                break;
            }
            case ONLINE_MULTIPL_MODE_ID: // Online Multiplayer
            {
                console.log("Creating online multiplayer lobby");
                io.emit("joinQueue", {});
                window.onbeforeunload = () => {
                    if (io)
                        io.emit("leaveQueue", {});
                }
                break;
            }
            default:
                console.warn("Invalid mode ID in matchmake", selectedModeID);
                goto("/game", { replaceState: true });
        }
    }
});

onDestroy(() => {
    console.log("onDestroy called");
    if (userInQueue && io != null) {
        io.emit("leaveQueue", {});
    }
});

</script>

<!-- HTML -->

<div class="center">
    <Container>
        <div class="loading">
            <b>Searching for players...</b>
            <span class="icon">
                <Icon src={Refresh} size={"24px"}/>
            </span>
        </div>
    </Container>
</div>

<!-- Styling -->
<style lang="scss">
.center {
    display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
    height: 100%;
}

.loading {
    display: flex;
    gap: 1rem;
    align-items: stretch;

    & b {
        font-size: x-large;
    }

    & .icon {
        width: 24px;
        height: 24px;
        animation-name: spin;
        animation-duration: 1000ms;
        animation-iteration-count: infinite;
        animation-timing-function: linear;

        @keyframes spin {
            to {
                transform:rotate(0deg);
            }
            from {
                transform:rotate(360deg);
            }
        }
    }

}
</style>

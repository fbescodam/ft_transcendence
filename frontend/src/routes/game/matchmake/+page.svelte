<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";
import { Icon, Refresh } from "svelte-hero-icons"
import Container from "$lib/Components/Container/Container.svelte";
import { onMount } from "svelte";
import { error } from "@sveltejs/kit";
import { goto } from "$app/navigation";
import { Modes, SINGLEPL_MODE_ID, LOCAL_MULTIPL_MODE_ID, ONLINE_MULTIPL_MODE_ID } from "$lib/Modes";

onMount(() => {
    const selectedModeParam = $page.url.searchParams.get('mode');
    const modeIds = Modes.map((val) => { return val.id; });

    if (selectedModeParam != null) {
        const selectedModeID = parseInt(selectedModeParam);
        switch (selectedModeID) {
            case SINGLEPL_MODE_ID: // Singleplayer
            case LOCAL_MULTIPL_MODE_ID: // Local Multiplayer
            {
                console.log("Creating singleplayer lobby");
                break;
            }
            case ONLINE_MULTIPL_MODE_ID: // Multiplayer
            {
                console.log("Creating multiplayer lobby");
                break;
            }
            default:
                console.warn("Invalid mode ID in matchmake", selectedModeID);
                goto("/game", { replaceState: true });
        }
    }
});

</script>

<!-- HTML -->

<div class="center">
    <Container>
        <div class="loading">
            <b>Searching</b>
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

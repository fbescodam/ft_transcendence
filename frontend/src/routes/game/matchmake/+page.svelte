<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";
import { Icon, Refresh } from "svelte-hero-icons"
import Container from "$lib/Components/Container/Container.svelte";
import { onMount } from "svelte";
import { error } from "@sveltejs/kit";
import { goto } from "$app/navigation";
import { Modes } from "$lib/Modes";

onMount(() => {
    const selectedModeParam = $page.url.searchParams.get('mode');
    const modeIds = Modes.map((val) => { return val.id; });

    if (selectedModeParam != null) {
        const selectedModeID = parseInt(selectedModeParam);
        if (modeIds.includes(selectedModeID)) {
            switch (selectedModeID) {
                case 0: // Singleplayer
                case 1: // Local Multiplayer
                {
                    console.log("Creating singleplayer lobby");
                    break;
                }
                case 2: // Multiplayer
                {
                    console.log("Creating multiplayer lobby");
                    break;
                }
                default:
                    throw error(400, "Invalid game mode!");
            }
        }
    }

    // Invalid, go back!
    goto("/game", { replaceState: true });
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


<!-- Scripting -->
<script lang="ts">
import { Modes } from "$lib/Game/Modes";
import Container from "$lib/Components/Container/Container.svelte";
import TileItem from "$lib/Components/TileItem/TileItem.svelte";


</script>

<!-- HTML -->

<Container>
    <h1>Select a game mode</h1>
</Container>
<hr />
<Container style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center">
    {#each Modes as mode}
        <TileItem href="/game/matchmake?mode={mode.id}" icon={mode.icon} text="{mode.name}"/>
    {/each}
</Container>

<!-- Styling -->
<style lang="scss">

</style>

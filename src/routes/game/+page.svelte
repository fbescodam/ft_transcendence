
<!-- Scripting -->
<script lang="ts">
import Container from "$lib/Components/Container/Container.svelte";
import TileItem from "$lib/Components/TileItem/TileItem.svelte";
import { Globe, User, Users } from "svelte-hero-icons";


</script>

<!-- HTML -->

<Container>
    <h1>Select a mode</h1>
</Container>
<hr />
<Container style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center">
    <TileItem href="/game" icon={User} text="Singleplayer"/>
    <TileItem href="/game" icon={Users} text="Local Multiplayer"/>
    <TileItem href="/game" icon={Globe} text="Online Multiplayer"/>
</Container>

<!-- Styling -->
<style lang="scss">

</style>
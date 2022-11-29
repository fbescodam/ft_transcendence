<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { displayName } from "$lib/Stores/User";
import { onMount } from "svelte";
import { goto } from "$app/navigation";

onMount(() => goto(`/profile/${$displayName}`, { replaceState: true }));
</script>

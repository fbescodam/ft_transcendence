<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";

export let name: string;
export let games: number;
export let wins: number;
export let loss: number;
export let status: string = "OFFLINE";

let ratio = wins / loss
if (wins == 0 && loss == 0)
	ratio = 0;

</script>

<!-- HTML -->

<div class="box">
	<b>Name: {name}</b>
	<b>Wins: {wins}</b>
	<b>Losses: {loss}</b>
	<b>Games: {games}</b>
	<b>Ratio: {ratio.toFixed(2)}</b>
	<b>Status: {status}</b>
</div>

<!-- Styling -->

<style lang="scss">

.box {
	display: flex;
	flex: 1;
	gap: 4px;
	flex-wrap: wrap;
	flex-direction: column;
	justify-content: center;

	border-radius: var(--border-radius);
}

</style>

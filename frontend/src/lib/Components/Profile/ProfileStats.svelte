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
let ratio = wins / loss;

// const getUserData = (async () => {
// 	const response = await fetch('https://dog.ceo/api/breeds/image/random')
// 	return await response.json()
// })()

</script>

<!-- HTML -->

<div class="box">
	<b>Name: {name}</b>
	<b>Wins: {wins}</b>
	<b>Losses: {loss}</b>
	<b>Games: {games}</b>
	<b>Ratio: {ratio}</b>
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
	
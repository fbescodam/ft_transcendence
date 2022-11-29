<!-----------------------------------------------------------------------------
 Codam Coding College, Amsterdam @ 2022.
 See README in the root project for more information.
------------------------------------------------------------------------------>

<!-- Scripting -->

<script lang="ts">
import { page } from "$app/stores";


const getUserData = (async () => {
	const response = await fetch('https://dog.ceo/api/breeds/image/random')
	return await response.json()
})()

</script>

<!-- HTML -->

<div class="box">
	<b>Name: {"lde-la-h"}</b>
	<b>Wins: {69}</b>
	<b>Losses: {0}</b>
	<b>Ratio: {0.421}</b>
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
	
	border-radius: 10px;
	backdrop-filter: blur(4px);
}

</style>
	
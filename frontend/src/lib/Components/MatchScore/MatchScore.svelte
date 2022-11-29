<script lang="ts">
import Container from "../Container/Container.svelte";
import ProfilePic from "../Profile/ProfilePic.svelte";

export let p1UserID: string | null;
export let p2UserID: string | null;
export let score: {p1: number, p2: number};
</script>

<!-- HTML -->

<Container>
	<div class="score">
		<ProfilePic userID={p1UserID} width={64} height={64}/>
		<!-- <img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03BQBHFG-12acdf20ecc8-512" alt="P1"/> -->
		<b>{score.p1} : {score.p2}</b>
		<ProfilePic userID={p2UserID} width={64} height={64}/>
		<!-- <img width={64} height={64} src="https://ca.slack-edge.com/T039P7U66-U03VCRL8328-f8fc04f7f629-512" alt="P2"/> -->
	</div>
</Container>

<style lang="scss">
.score {
	display: flex;
	align-items: center;
	overflow: hidden;
	justify-content: space-between;
	font-family: 'Common Pixel', sans-serif;

	& b {
		font-size: xx-large;
	}

	& img {
		border-radius: 8px;
	}
}
</style>
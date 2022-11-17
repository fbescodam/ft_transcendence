<script lang="ts">
import { Icon, type IconSource } from "svelte-hero-icons";

/** The URL to direct to. */
export let href: string;
/** The name of the tile. */
export let text: string;
/** The Icon to use. */
export let icon: IconSource;
</script>

<a {href}>
	<div class="project-content">
		<Icon src={icon} size="4rem" />
		<p>{text}</p>
	</div>
</a>

<!-- Styles -->
<style lang="scss">
a {
	text-decoration: none;

	color: var(--foreground);
	padding: 10px;

	width: 365px;
	height: 256px;

	border-radius: var(--border-radius);
	background-color: var(--component-secondary-bg);

	transition: all 0.2s;

	&:hover {
		transform: scale(1.05);
		box-shadow: 0.5px 0.5px 0.4em var(--shadow);
	}
}

.project-content {
    height: 95%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    & p {
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 75%;

        height: 2rem;
        font-size: 1.42rem;
    }
}
</style>
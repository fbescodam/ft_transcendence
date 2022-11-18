<script lang="ts">
import { goto } from "$app/navigation";

let loggedIn = false;

if (!loggedIn) {
	goto("/auth", { replaceState: true });
}

</script>

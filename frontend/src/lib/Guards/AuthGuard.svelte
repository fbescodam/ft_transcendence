<script lang="ts">
import { goto } from "$app/navigation";

if (!window.localStorage.getItem("jwt")) {
	goto("/auth", { replaceState: true });
}

</script>

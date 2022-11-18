<script lang="ts">
import { JWT } from "$lib/Stores/User";
import { goto } from "$app/navigation";
import { page } from '$app/stores';

if (($JWT == null || $JWT == undefined) && !$page.url.pathname.startsWith("/auth")) {
	goto("/auth", { replaceState: true });
}

</script>

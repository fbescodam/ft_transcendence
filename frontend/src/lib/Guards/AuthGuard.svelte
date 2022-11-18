<script lang="ts">
import { JWT } from "$lib/Stores/User";
import { goto } from "$app/navigation";

if ($JWT == null) {
	goto("/auth", { replaceState: true });
}

</script>

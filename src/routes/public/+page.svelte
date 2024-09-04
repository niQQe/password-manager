<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
</script>

<button onclick={() => goto('/public/signin')} class="rounded bg-blue-600" type="submit"
	>Sign in</button
>

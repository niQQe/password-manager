<script>
	const { data: propsData, children } = $props();
	import { invalidate } from '$app/navigation';
	const { supabase, session } = propsData;
	import { goto } from '$app/navigation';

	$effect(() => {
		if (session) {
			goto('/private');
		}
	});
</script>

<div class="h-full w-full">
	{#if session}
		Loading...
	{/if}
	{#if !session}
		{@render children()}
	{/if}
</div>

<style></style>

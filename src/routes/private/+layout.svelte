<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	const { data: propsData, children } = $props();
	const { supabase, session } = propsData;

	let isLoggedIn = $state(false);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (!newSession) {
				/**
				 * Queue this as a task so the navigation won't prevent the
				 * triggering function from completing
				 */
				setTimeout(() => {
					goto('/public/signin', { invalidateAll: true });
				});
			}
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}

			isLoggedIn = true;
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="h-full w-full">
	<Toaster />
	{#if isLoggedIn}
		{@render children()}
	{:else}
		Loading...
	{/if}
</div>

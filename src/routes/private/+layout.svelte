<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	const { data: propsData, children } = $props();
	const { supabase, session } = propsData;
	import LeftNav from './LeftNav.svelte';
	import TopHeader from './TopHeader.svelte';
	import Content from './Content.svelte';
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

<div class="flex h-[100vh] w-full">
	<Toaster />
	<div class="flex w-full overflow-hidden">
		{#if isLoggedIn}
			<LeftNav email={propsData.user?.email} />
			<!-- Content -->
			<div class="flex w-full flex-col gap-3 bg-[#121212]">
				<!-- <TopHeader /> -->
				{@render children()}
			</div>
		{:else}
			Loading...
		{/if}
	</div>
</div>

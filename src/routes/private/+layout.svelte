<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import Loader from '$lib/components/ui/loader/loader.svelte';
	const { data: propsData, children } = $props() as any;
	import type { PasswordType } from './private.types';
	import { onMount } from 'svelte';
	const { supabase, session } = propsData;
	import LeftNav from './LeftNav.svelte';
	import { decrypt } from '$lib/encryption/crypto';
	import { privateData } from './store/store.svelte';
	let isLoggedIn = $state(false);
	let argonLoaded = $state(false);

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange(async (_, newSession) => {
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

	$effect(() => {
		(async () => {
			privateData.salt = propsData.salt;

			const decryptedData = await decrypt(
				{
					masterPassword: 'Spqmd!Vodk07',
					salt: propsData.salt,
					data: propsData.userData.data,
					ivBase64: propsData.userData.iv,
					tagBase64: propsData.userData.tag
				},
				window.argon2,
				window.crypto,
				true
			);
			if (decryptedData === null) return;

			const parsedItems = JSON.parse(decryptedData ?? '[]');

			console.log(parsedItems);

			privateData.data.passwords = parsedItems.passwords;
			privateData.data.notes = parsedItems.notes;
			privateData.passwordDetails = Object.values(parsedItems.passwords)[0] as PasswordType;
		})();
	});

	onMount(async () => {});
</script>

<div class="flex h-[100vh] w-full">
	<Toaster />
	<div class="flex w-full overflow-hidden">
		{#if isLoggedIn}
			<LeftNav email={propsData.user?.email} {supabase} />
			<!-- Content -->
			<div class="flex w-full flex-col gap-3 bg-[#121212]">
				<!-- <TopHeader /> -->
				{@render children()}
			</div>
		{:else}
			<div class="m-auto">
				<Loader />
			</div>
		{/if}
	</div>
</div>

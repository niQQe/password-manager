<script lang="ts">
	import { privateData } from '../store/store.svelte';
	import { Search, X } from 'lucide-svelte';

	import { onMount } from 'svelte';

	import PasswordCard from './PasswordCard.svelte';
	import type { PasswordType } from '../private.types';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import AddPasswordModal from './AddPasswordModal.svelte';

	dayjs.extend(relativeTime);
	let isScrolling = $state(false);
	let itemWrapper: HTMLDivElement | null = $state(null);
	let inputFocused = $state(false);
	let searchValue = $state('');

	const noItems = $derived(() => !Object.keys(privateData.data.passwords ?? {})?.length);

	const derivedItems = $derived(() => {
		const searchLower = searchValue.toLowerCase();
		const result: {
			favorites: PasswordType[];
			sorted: PasswordType[];
		} = { favorites: [], sorted: [] };

		Object.values(privateData.data.passwords ?? {}).forEach((password) => {
			const combinedKey = `${password.company_name} ${password.url}`.toLowerCase();

			// If the password doesn't match the search, skip it
			if (!combinedKey.includes(searchLower)) return;

			// Add password to the favorites or sorted list
			if (password.favorite) {
				result.favorites.push(password);
			} else {
				result.sorted.push(password);
			}
		});

		// Sort non-favorites by `created_at`
		result.sorted.sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);

		return result;
	});

	onMount(() => {
		if (itemWrapper === null) return;
		itemWrapper.addEventListener('scroll', () => {
			isScrolling = itemWrapper!.scrollTop > 30;
		});
	});
</script>

<div class="flex h-full min-h-full flex-1 flex-col bg-[#121212]">
	<div class="flex h-full flex-col">
		<div
			class="z-[10] flex flex-col gap-3.5 px-[35px] pb-4 pt-10 transition-all"
			style={`${isScrolling ? 'box-shadow:0px 0px 20px 0px #000' : ''}`}
		>
			<div class="flex items-center justify-between font-bold">
				<div class="text-[34px]">All Passwords</div>
				<div class="flex items-center gap-6">
					<div
						class={`relative flex h-[48px] w-[350px] items-center   gap-3 overflow-hidden rounded-full bg-white/10 pl-[12px] pr-[40px] transition-all hover:bg-white/[12%] ${inputFocused ? '!bg-white/[12%]' : ''}`}
					>
						<div class:!opacity-80={inputFocused} class="opacity-50 transition-all">
							<Search size="26" />
						</div>

						<input
							bind:value={searchValue}
							onfocus={() => (inputFocused = true)}
							onblur={() => (inputFocused = false)}
							placeholder="Search for password"
							class="h-full w-full bg-transparent"
							type="text"
						/>
						{#if searchValue.length > 0}
							<button
								class="absolute right-0 flex h-full w-[48px] items-center justify-center"
								onclick={() => (searchValue = '')}
							>
								<X size="20" />
							</button>
						{/if}
					</div>
					<AddPasswordModal />
				</div>
			</div>
		</div>
		{#if noItems()}
			<div class="flex h-full w-full">
				<div class="m-auto flex flex-col gap-2">
					<div class="border-b border-white/10 pb-3 text-center text-2xl font-bold">
						No passwords added yet!
					</div>
					<div class="text-center text-white/70">
						Use the plus [+] button at the top to add some!
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-1 flex-col overflow-auto p-4" bind:this={itemWrapper}>
				{#if derivedItems().favorites.length > 0}
					<div class="px-4 py-4 pt-2 text-sm font-extralight uppercase tracking-wide text-white/60">
						Favorites
					</div>
					<div class="mb-3 flex flex-col">
						{#each derivedItems().favorites as password}
							<PasswordCard {password} />
						{/each}
					</div>
				{/if}
				{#if derivedItems().sorted.length > 0}
					<div class="px-4 py-4 pt-2 text-sm font-extralight uppercase tracking-wide text-white/60">
						Sorted by newest
					</div>
				{/if}
				{#each derivedItems().sorted as password}
					<PasswordCard {password} />
				{/each}
				{#if !derivedItems().favorites.length && !derivedItems().sorted.length}
					<div class="flex w-full flex-1">
						<div class="m-auto flex flex-col items-center justify-center gap-3 text-white/60">
							<div class="text-4xl"><Search size="30" class="text-[#4cc3a4]" /></div>
							<div class="text-xl">No items found</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
</style>

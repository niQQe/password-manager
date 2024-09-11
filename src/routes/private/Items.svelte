<script lang="ts">
	import { privateStates } from './store/store.svelte';
	import { Search, X } from 'lucide-svelte';

	import { onMount } from 'svelte';

	import ItemCard from './ItemCard.svelte';
	import type { ItemType } from './private.types';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import CreateItem from './CreateItem.svelte';

	dayjs.extend(relativeTime);
	let isScrolling = $state(false);
	let itemWrapper: HTMLDivElement;
	let inputFocused = $state(false);
	let searchValue = $state('');

	const derivedItems = $derived(() => {
		const searchLower = searchValue.toLowerCase();
		const result: {
			favorites: ItemType[];
			sorted: ItemType[];
		} = { favorites: [], sorted: [] };

		Object.values(privateStates.items).forEach((item) => {
			const combinedKey = `${item.company_name} ${item.url}`.toLowerCase();

			// If the item doesn't match the search, skip it
			if (!combinedKey.includes(searchLower)) return;

			// Add item to the favorites or sorted list
			if (item.favorite) {
				result.favorites.push(item);
			} else {
				result.sorted.push(item);
			}
		});

		// Sort non-favorites by `created_at`
		result.sorted.sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);

		return result;
	});

	onMount(() => {
		itemWrapper.addEventListener('scroll', () => {
			if (itemWrapper.scrollTop > 30) {
				isScrolling = true;
			} else {
				isScrolling = false;
			}
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
							class="w-full bg-transparent"
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
					<CreateItem />
				</div>
			</div>
		</div>
		<div class="flex flex-1 flex-col overflow-auto p-4" bind:this={itemWrapper}>
			{#if derivedItems().favorites.length > 0}
				<div class="px-4 py-4 pt-2 text-sm font-extralight uppercase tracking-wide text-white/60">
					Favorites
				</div>
				<div class="mb-3 flex flex-col">
					{#each derivedItems().favorites as item}
						<ItemCard {item} />
					{/each}
				</div>
			{/if}
			{#if derivedItems().sorted.length > 0}
				<div class="px-4 py-4 pt-2 text-sm font-extralight uppercase tracking-wide text-white/60">
					Sorted by newest
				</div>
			{/if}
			{#each derivedItems().sorted as item}
				<ItemCard {item} />
			{/each}
			{#if derivedItems().favorites.length === 0 && derivedItems().sorted.length === 0}
				<div class="flex w-full flex-1">
					<div class="m-auto flex flex-col items-center justify-center gap-3 text-white/60">
						<div class="text-4xl"><Search size="30" class="text-[#4cc3a4]" /></div>
						<div class="text-xl">No items found</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
</style>

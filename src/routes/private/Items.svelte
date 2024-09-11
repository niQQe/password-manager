<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { privateStates } from './store/store.svelte';
	import { SquareAsterisk, Star, Search } from 'lucide-svelte';
	import { clone } from '$lib/utils/';
	import { onMount } from 'svelte';

	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import CreateItem from './CreateItem.svelte';

	dayjs.extend(relativeTime);
	let openCreateItemDialog = $state(false);
	let isScrolling = $state(false);
	let itemWrapper: HTMLDivElement;

	function handleShowItemDetails(itemid: string) {
		privateStates.itemDetails = clone(privateStates.items[itemid]);
	}

	onMount(() => {
		itemWrapper.addEventListener('scroll', () => {
			if (itemWrapper.scrollTop > 50) {
				isScrolling = true;
			} else {
				isScrolling = false;
			}
		});
	});
</script>

<div class="flex h-full min-h-full flex-1 flex-col overflow-auto bg-[#121212]">
	<div
		class="relative z-[10] flex gap-6 p-[30px] py-[32px] pb-[25px] transition-all duration-300 ease-linear flex justify-between"
		style={`${isScrolling ? 'box-shadow:0px 0px 20px 0px #000' : ''}`}
	>
		<div class="relative w-full max-w-[50%]">
			<Search size="18" class="absolute left-4 top-4 text-gray-500" />
			<input
				placeholder="Search passwords"
				class="w-full rounded-full bg-white px-6 py-3 pl-12 text-gray-800 ring ring-transparent transition-all duration-300 focus:border-none focus:outline-none focus:ring-[#4cc3a4]"
			/>
		</div>
		<CreateItem open={openCreateItemDialog} />
	</div>
	<div class="flex h-full flex-col gap-1 overflow-auto" bind:this={itemWrapper}>
		<div class="flex flex-col gap-3.5 px-[35px]">
			<div class="text-[34px] font-bold">All Passwords</div>
		</div>
		<div class=" mt-4 px-8 text-sm font-extralight uppercase tracking-wide text-white/60">
			Favorites
		</div>
		<div class="flex flex-col p-4">
			{#each Object.values(privateStates.items) as item}
				<button
					onclick={() => handleShowItemDetails(item.itemid)}
					class="flex items-center gap-6 rounded-2xl p-4 py-5 transition-all hover:bg-black/15"
					class:!bg-[#0a0a0a]={privateStates.itemDetails.itemid === item.itemid}
				>
					<div class="h-[55px] w-[55px] overflow-hidden rounded-full">
						{#if item.ogData.logo}
							<div
								class="contain h-full w-full"
								style={`background-image:url(${item.ogData.logo});background-size:cover; background-position:50%`}
							></div>
						{:else}
							<div
								class="flex h-full w-full rounded-full border-4 border-[#153029]"
								style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
							>
								<SquareAsterisk size="24" class="m-auto text-white" />
							</div>
						{/if}
					</div>
					<div class="flex flex-1 flex-col">
						<div class="text-left text-xl font-semibold tracking-wider">{item.company_name}</div>
						<div class="text-left text-sm tracking-wider text-white/70">{item.url}</div>
					</div>
					<div class="flex items-center"><Star fill="#fff" /></div>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
</style>

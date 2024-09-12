<script lang="ts">
	import { privateStates } from './store/store.svelte';
	import { clone } from '$lib/utils/';
	import { saveItem } from './store/store.svelte';
	import type { ItemType } from './private.types';
	import { SquareAsterisk, Star } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	function handleShowItemDetails(itemid: string) {
		privateStates.itemDetails = clone(privateStates.items[itemid]);
	}

	async function handleUpdateFavorite(formData: FormData, item: ItemType) {
		privateStates.items[item.itemid].favorite = !privateStates.items[item.itemid].favorite;
		await saveItem(formData, item);
		return ({ result }: { result: any }) => {
			privateStates.items[item.itemid].favorite = result.data.body.favorite;
		};
	}

	const {
		item
	}: {
		item: ItemType;
	} = $props();
</script>

<div
	tabindex="0"
	role="button"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') handleShowItemDetails(item.itemid);
	}}
	onclick={() => handleShowItemDetails(item.itemid)}
	class="flex items-center gap-6 rounded-2xl p-4 py-5 hover:bg-black/15"
	class:!bg-[#0a0a0a]={privateStates.itemDetails.itemid === item.itemid}
>
	<div class="h-[55px] w-[55px] overflow-hidden rounded-full">
		<div
			class="contain h-full w-full"
			style={`background-image:url('https://img.logo.dev/${new URL(item.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:55px; background-position:50%`}
		></div>
	</div>
	<div class="flex flex-1 flex-col">
		<div class="text-left text-xl font-semibold tracking-wider">
			{item.company_name}
		</div>
		<div class="text-left text-sm tracking-wider text-white/70">{item.url.replace('https://', '')}</div>
	</div>
	<div class="flex items-center">
		<form
			action="/private?/modifyItem"
			use:enhance={({ formData }) => handleUpdateFavorite(formData, item)}
			method="POST"
		>
			<button type="submit" onclick={(event) => event.stopPropagation()}>
				<Star
					size="22"
					class="text-white/80 hover:text-white mt-1"
					fill={item.favorite ? '#fff' : 'transparent'}
				/>
			</button>
		</form>
	</div>
</div>

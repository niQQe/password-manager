<script lang="ts">
	import type { ItemType } from './private.types';
	import { decrypt } from '$lib/encryption/crypto';
	import { privateStates } from './store/store.svelte';
	import ItemDetails from './ItemDetails.svelte';
	import Items from './Items.svelte';

	const { data } = $props() as any;

	$effect(() => {
		(async () => {
			privateStates.salt = data.salt;
			if (!window.argon2) await import('argon2-browser');
			if (!data.items?.data) return;

			const decryptedData = await decrypt(
				{
					masterPassword: 'Spqmd!Vodk07',
					salt: data.salt,
					data: data.items.data,
					ivBase64: data.items.iv,
					tagBase64: data.items.tag
				},
				window.argon2,
				window.crypto,
				true
			);

			if (decryptedData === null) return;

			const parsedItems = JSON.parse(decryptedData ?? '[]');

			const mappedItems = parsedItems.reduce((acc: Record<string, ItemType>, curr: ItemType) => {
				acc[curr.itemid] = curr;
				return acc;
			}, {});

			privateStates.items = mappedItems;
			privateStates.itemDetails = parsedItems[0];
		})();
	});
</script>

<div class="flex h-full w-full">
	<Items />
	<ItemDetails />
</div>

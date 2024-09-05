<script lang="ts">
	import type { ItemType } from './private.types';
	import { onMount } from 'svelte';
	import { decrypt } from '$lib/encryption/crypto';
	import { Button } from '$lib/components/ui/button/index.js';
	import { privateStates } from './store/store.svelte';
	import DataTable from './components/data-table.svelte';
	import AddItemDialog from './components/add-password.svelte';
	import LeftNav from './components/left-nav.svelte';

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
				window.crypto
			);

			if (decryptedData === null) return;

			const parsedItems = JSON.parse(decryptedData ?? '[]');

			console.log(parsedItems);
			const mappedItems = parsedItems.reduce((acc: Record<string, ItemType>, curr: ItemType) => {
				acc[curr.itemid] = curr;
				return acc;
			}, {});

			privateStates.items = mappedItems;
		})();
	});

	onMount(async () => {});
</script>

<div>
	<div class="flex w-full">
		<LeftNav />
		<div class="ml-[280px] flex w-full flex-col gap-3 p-6">
			<div class="flex items-center gap-3">
				<AddItemDialog />
				<Button type="submit" variant="outline">Import</Button>
				<Button type="submit" variant="outline">Share</Button>
			</div>
			<DataTable />
		</div>
	</div>
</div>

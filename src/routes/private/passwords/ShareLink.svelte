<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import * as Select from '$lib/components/ui/select/index.js';
	import { generateLink } from '../store/store.svelte';
	import { nanoid } from 'nanoid';
	import { copyToClipboard } from '$lib/utils/';

	const { passwordid }: { passwordid: string } = $props();

	const expirationOptions = [
		{ value: 1, label: 'One minute' },
		{ value: 2, label: 'One hour' },
		{ value: 3, label: 'One day' },
		{ value: 4, label: 'One week' },
		{ value: 5, label: 'One month' }
	];

	let linkUsesOptions = {
		1: 1,
		5: 5,
		10: 10,
		50: 50,
		100: 100
	};

	let linkCopied = $state(false);

	let generatedLink: string = $state('');
	let password: string = $state('');

	let selectedExpirationTime: number | null = $state(null);

	let selectedLinkUses = $state(1);

	function handleCopyToClipboard() {
		copyToClipboard(generatedLink);
		linkCopied = true;
		setTimeout(() => {
			linkCopied = false;
		}, 2000);
	}

	async function handleGenerateLink(formData: FormData) {
		password = nanoid(16);
		await generateLink(formData, passwordid, password, selectedLinkUses, selectedExpirationTime);
		return ({ result }: { result: any }) => {
			generatedLink = `http://localhost:5173/share/${result.data.body.linkid}${password}`;
		};
	}
</script>

<div class="p-4">
	<div class="flex flex-col gap-6">
		<div class="text-sm text-white/80">
			To share a password, select the expiration date for the link using the provided options. You
			can also set how many times the link can be accessed before it expires.
		</div>
		<div class="flex flex-col gap-1">
			<div class="text-sm font-normal tracking-wide text-white/50">Expiration time</div>
			<div class="flex">
				<Select.Root portal={null}>
					<Select.Trigger
						class="w-[180px] border-none bg-[#292929] transition-all hover:bg-white/20"
					>
						<Select.Value placeholder="No limit" />
					</Select.Trigger>
					<Select.Content class="border-none bg-[#292929] ">
						<Select.Group>
							{#each expirationOptions as option}
								<Select.Item
									onclick={() => (selectedExpirationTime = option.value)}
									class="hover:bg-[#545454]"
									value={option.value}
									label={option.label}>{option.label}</Select.Item
								>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<div class="text-sm font-normal tracking-wide text-white/50">Link uses</div>
			<div class="flex gap-3">
				{#each Object.values(linkUsesOptions) as value}
					<button
						class={` ${selectedLinkUses === value ? 'bg-white/30' : ''} min-w-[40px] rounded-md bg-[#292929] p-2 text-sm transition-all hover:bg-white/20`}
						onclick={() => (selectedLinkUses = value)}>{value}</button
					>
				{/each}
			</div>
		</div>
		<div class="flex flex-col gap-3">
			<div class="text-xl font-semibold">Generated link</div>
			<div
				class="text- relative h-[46px] w-full overflow-hidden truncate rounded-md border border-white/15 px-3 py-3 pr-10 text-sm text-white/60"
				class:!text-[#4cc3a4]={generatedLink.length}
			>
				{#if generatedLink.length}
					{#if linkCopied}
						<Check size="20" class="absolute right-3 top-3 cursor-pointer text-green-500" />
					{:else}
						<Copy
							size="20"
							class="absolute right-3 top-3 cursor-pointer text-white/80 hover:text-white"
							onclick={() => handleCopyToClipboard()}
						/>
					{/if}
				{/if}
				{generatedLink.length ? generatedLink : 'Your generated link will be shown here'}
			</div>
		</div>
		<form
			action="/private?/createSharedLink"
			class="flex justify-end"
			method="POST"
			use:enhance={({ formData }) => handleGenerateLink(formData)}
		>
			<button
				type="submit"
				class="rounded-lg p-3 px-4 text-sm font-medium tracking-[0.5px]"
				style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
				>Generate link</button
			>
		</form>
	</div>
</div>

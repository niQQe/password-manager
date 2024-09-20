<script lang="ts">
	import type { PasswordType } from '../private.types';
	import { Info } from 'lucide-svelte';
	import { privateData } from '../store/store.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { checkPassword } from './checkCompromisedPasswords';
	import { PasswordMeter } from 'password-meter';
	import ChangePasswordModal from './ChangePasswordModal.svelte';
	import PasswordStats from './PasswordStats.svelte';

	let currentItem: PasswordType | null = $state(null);
	let openChangePasswordModal = $state(false);

	function handlePressItem(item: PasswordType) {
		currentItem = item;
		openChangePasswordModal = true;
	}

	function setOpenChangePasswordModal(value: boolean) {
		openChangePasswordModal = value;
	}

	const filterOptions: Record<string, boolean> = $state({
		all: true,
		compromised: false,
		weak: false,
		reused: false
	});

	const reusedPasswordCount = $derived(() => {
		return Object.values(privateData.data.passwords).reduce(
			(acc: Record<string, number>, curr: PasswordType) => {
				acc[curr.password] = (acc[curr.password] || 0) + 1;
				return acc;
			},
			{}
		);
	});

	const atRiskPasswords = $derived(() => {
		if (filterOptions.weak) {
			return Object.values(privateData.data.passwords).filter((password) => {
				return new PasswordMeter().getResult(password.password).percent < 50;
			});
		}
		if (filterOptions.reused) {
			return Object.values(privateData.data.passwords).filter((password) => {
				return reusedPasswordCount()[password.password] > 1;
			});
		}
		return Object.values(privateData.data.passwords).filter((password) => {
			return (
				new PasswordMeter().getResult(password.password).percent < 50 ||
				reusedPasswordCount()[password.password] > 1
			);
		});
	});

	onMount(async () => {
		if (browser) {
			// const res = await checkPassword('test');
			// console.log(res);
		}
	});
</script>

{#if currentItem}
	<ChangePasswordModal
		item={currentItem}
		open={openChangePasswordModal}
		{setOpenChangePasswordModal}
	/>
{/if}
<div class="flex h-full flex-col overflow-auto">
	<div class="flex flex-col gap-2 bg-[#0a0a0a] p-[40px]">
		<div>
			<div class="text-[34px] font-bold">Password health</div>
		</div>
		<PasswordStats {reusedPasswordCount} />
	</div>
	<div class="flex h-full flex-col gap-4 p-4 pt-6">
		<div class="flex w-full items-center justify-between">
			<div class="px-4 text-xs uppercase text-white/60">At-risk passwords</div>
			<div class="flex gap-1 rounded-lg bg-black/20 p-1 text-[15px] font-medium">
				{#each Object.keys(filterOptions) as option}
					<button
						class={`min-w-[50px] rounded-md px-2 py-1 capitalize text-white/80 transition-all hover:bg-white/[5%] ${filterOptions[option] ? '!bg-white/10 !text-white' : ''} `}
						onclick={() => {
							Object.keys(filterOptions).forEach((key) => {
								filterOptions[key] = false;
							});
							filterOptions[option] = true;
						}}
					>
						{option}
					</button>
				{/each}
			</div>
		</div>
		<div class="flex flex-col divide-y divide-white/[3%]">
			{#each atRiskPasswords() as password}
				<div
					tabindex="0"
					role="button"
					class="flex items-center gap-6 p-3 py-3 hover:bg-black/15"
					onclick={() => handlePressItem(password)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') handlePressItem(password);
					}}
				>
					<div class="h-[35px] w-[35px] overflow-hidden rounded-full">
						<div
							class="contain h-full w-full"
							style={`background-image:url('https://img.logo.dev/${new URL(password.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:35px; background-position:50%`}
						></div>
					</div>
					<div class="flex flex-1 flex-col">
						<div class="text-md text-left font-semibold tracking-wider">
							{password.company_name}
						</div>
						<div class="text-left text-sm tracking-wider text-white/70">
							{password.url.replace('https://', '')}
						</div>
					</div>
					<div class="flex items-center justify-end">
						<div class="flex">
							{#if reusedPasswordCount()[password.password] > 1}
								<div class="flex items-center gap-2 text-[13px]">
									<Info class="text-orange-600" size="18"></Info>
									<div class="min-w-[100px] text-right">
										Reused {reusedPasswordCount()[password.password]} times
									</div>
								</div>
							{:else}
								<div class="flex items-center gap-2 text-[13px]">
									<Info class="text-yellow-600" size="18"></Info>
									<div class="min-w-[100px] text-right">Weak password</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

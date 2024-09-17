<script lang="ts">
	import { RefreshCcw, Info } from 'lucide-svelte';
	import { privateStates } from '../store/store.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { checkPassword } from './checkCompromisedPasswords';
	import type { ItemType } from '../private.types';
	import { PasswordMeter } from 'password-meter';
	import type { IResult } from 'password-meter';

	const reusedPasswordCount = $derived(() => {
		return Object.values(privateStates.items).reduce(
			(acc: Record<string, number>, curr: ItemType) => {
				acc[curr.password] = (acc[curr.password] || 0) + 1;
				return acc;
			},
			{}
		);
	});

	const totalReusedPasswordCount = $derived(() => {
		return Object.values(privateStates.items).filter(
			(item) => reusedPasswordCount()[item.password] > 1
		).length;
	});

	const totalWeakPasswordsCount = $derived(() => {
		return Object.values(privateStates.items).filter(
			(item) => new PasswordMeter().getResult(item.password).percent < 50
		).length;
	});

	const averagePasswordStrength = $derived(() => {
		const total = Object.values(privateStates.items).reduce((acc, curr) => {
			return acc + new PasswordMeter().getResult(curr.password).percent;
		}, 0);
		return Math.round(total / Object.values(privateStates.items).length);
	});

	const atRiskPasswords = $derived(() => {
		return Object.values(privateStates.items).filter((item) => {
			return (
				new PasswordMeter().getResult(item.password).percent < 50 ||
				reusedPasswordCount()[item.password] > 1
			);
		});
	});

	onMount(async () => {
		console.log(Object.values(privateStates.items).length);
		if (browser) {
			// const res = await checkPassword('test');
			// console.log(res);
		}
	});
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="flex flex-col gap-2 bg-[#0a0a0a] p-[40px]">
		<div>
			<div class="text-[34px] font-bold">Password health</div>
		</div>
		<div class="flex w-full flex-col gap-10">
			<div class="flex flex-col gap-6 text-sm text-white/70">
				<div class="flex gap-3 text-xs">
					<div>Last checked:</div>
					<span class="text-white">Just now</span>
					<div class="text-[#4cc3a4]">
						<RefreshCcw size="16" class="cursor-pointer" />
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-4 rounded-xl">
				<div class="flex items-center gap-6">
					<div class="mr-6 flex flex-col gap-1">
						<div class="flex flex-col gap-6">
							<div class="text-sm text-white/60">Average password strength</div>
							<div class="flex w-full justify-center">
								<div class="relative flex h-[130px] w-[130px]">
									<div class="m-auto text-[26px] font-medium">{averagePasswordStrength()}%</div>
									<div
										class="absolute left-[3px] top-[3px] h-[124px] w-[124px] rounded-full border-[14px] border-green-600/[5%]"
									></div>
									<svg
										width="130"
										height="130"
										viewBox="0 0 160 160"
										style="transform: rotate(-90deg)"
										class="absolute left-0 top-0"
									>
										<circle
											r="70"
											cx="80"
											cy="80"
											fill="transparent"
											stroke="url(#gradient)"
											class="transition-all duration-1000"
											stroke-linecap="round"
											stroke-width="14px"
											stroke-dasharray="439.6px"
											stroke-dashoffset={439.6 * (1 - averagePasswordStrength() / 100)}
										></circle>
										<defs>
											<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
												<stop offset="0%" stop-color="#05a" />
												<stop offset="100%" stop-color="#0a5" />
											</linearGradient>
										</defs>
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div class="mt-8 flex gap-12">
						<div class="flex gap-6">
							<div class="flex items-center gap-4">
								<div><Info class="text-red-600" size="20"></Info></div>
								<div class="text-md flex flex-col">
									<div class="font-semibold">201 Compromised passwords</div>
									<div class="text-sm text-white/80">You should change these now.</div>
								</div>
							</div>
						</div>
						<div class="flex gap-6">
							<div class="flex items-center gap-4">
								<div><Info class="text-orange-600" size="20"></Info></div>
								<div class="text-md flex flex-col">
									<div class="font-semibold">{totalReusedPasswordCount()} reused passwords</div>
									<div class="text-sm text-white/80">Create unique passwords</div>
								</div>
							</div>
						</div>
						<div class="flex gap-6">
							<div class="flex items-center gap-4">
								<div><Info class="text-yellow-600" size="20"></Info></div>
								<div class="text-md flex flex-col">
									<div class="font-semibold">{totalWeakPasswordsCount()} weak passwords</div>
									<div class="text-sm text-white/80">Create unique passwords</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex h-full flex-col gap-4 p-4 pt-8">
		<div class="px-4 text-xs uppercase text-white/60">At-risk passwords</div>
		<div class="flex flex-col divide-y divide-white/[3%]">
			{#each atRiskPasswords() as item}
				<div tabindex="0" role="button" class="flex items-center gap-6 p-3 py-3">
					<div class="h-[35px] w-[35px] overflow-hidden rounded-full">
						<div
							class="contain h-full w-full"
							style={`background-image:url('https://img.logo.dev/${new URL(item.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:35px; background-position:50%`}
						></div>
					</div>
					<div class="flex flex-1 flex-col">
						<div class="text-md text-left font-semibold tracking-wider">
							{item.company_name}
						</div>
						<div class="text-left text-sm tracking-wider text-white/70">
							{item.url.replace('https://', '')}
						</div>
					</div>
					<div class="flex items-center justify-end">
						<div class="flex">
							{#if reusedPasswordCount()[item.password] > 1}
								<div class="flex items-center gap-2 text-[13px]">
									<Info class="text-orange-600" size="18"></Info>
									<div class="min-w-[100px] text-right">
										Reused {reusedPasswordCount()[item.password]} times
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

<script lang="ts">
	import { decrypt } from '$lib/encryption/crypto';
	import { SquareAsterisk, Check, Copy, Eye, EyeOff, CircleAlert } from 'lucide-svelte';
	import { copyToClipboard } from '$lib/utils/';

	import { page } from '$app/stores';

	const { data: propsData } = $props() as any;

	let item: any = $state();
	let showPassword = $state(false);
	let copiedPassword = $state(false);
	let error = $state(false);

	function handleCopyToClipboard(value: string) {
		copiedPassword = true;
		setTimeout(() => {
			copiedPassword = false;
		}, 3000);
		copyToClipboard(value);
	}

	$effect(() => {
		(async () => {
			if (!propsData.data) {
				error = true;
				return;
			}
			const { data, salt, iv, tag } = propsData;
			// get url params

			const password = $page.params.id.slice(-16);

			const result = await decrypt(
				{ masterPassword: password, data, salt, ivBase64: iv, tagBase64: tag },
				window.argon2,
				window.crypto,
				false
			);
			if (result) {
				item = JSON.parse(result);
			} else {
				error = true;
			}
		})();
	});
</script>

<div class="flex h-[100vh] w-full">
	{#if error}
		<div class="m-auto flex w-full max-w-[500px] flex-col gap-8 rounded-3xl bg-[#0a0a0a] p-8">
			<div class="flex items-center gap-3 text-3xl font-bold text-white">
				<CircleAlert size="32" class="text-red-500" />
				Invalid link
			</div>
			<div class="text-white/80">
				The link you are trying to access is invalid or has expired. Please check the link and try
				again.
			</div>
		</div>
	{/if}
	{#if item}
		<div class="m-auto flex w-full max-w-[500px] flex-col gap-8 rounded-3xl bg-[#0a0a0a] p-8">
			<div class="flex w-full items-center gap-6">
				<div class="h-[80px] w-[80px] overflow-hidden rounded-full">
					<div
						class="contain h-full w-full"
						style={`background-image:url('https://img.logo.dev/${new URL(item.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:80px; background-position:50%`}
					></div>
				</div>
				<div class="flex flex-col">
					<div class="flex max-w-[200px] items-center gap-3 truncate text-3xl font-bold">
						{item.company_name}
					</div>
					<div class="text-lg text-white/80">
						{item.url}
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-1">
					<div class="text-sm text-white/80">Username/email</div>
					<div
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
					>
						{item.username}
					</div>
				</div>
				<div class="relative flex flex-col gap-1">
					{#if copiedPassword}
						<Check size="20" class="absolute right-0 top-6 cursor-pointer text-green-500" />
					{:else}
						<Copy
							size="20"
							class="absolute right-0 top-6 cursor-pointer text-white/80 hover:text-white"
							onclick={() => handleCopyToClipboard(item.password)}
						/>
					{/if}
					{#if !showPassword}
						<Eye
							onclick={() => (showPassword = true)}
							size="20"
							class="absolute right-8 top-6 cursor-pointer text-white/80 hover:text-white"
						/>
					{:else}
						<EyeOff
							onclick={() => (showPassword = false)}
							size="20"
							class="absolute right-8 top-6 cursor-pointer text-white/80 hover:text-white"
						/>
					{/if}
					<div class="text-sm text-white/80">Password</div>
					<input
						type={showPassword ? 'text' : 'password'}
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						value={item.password}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

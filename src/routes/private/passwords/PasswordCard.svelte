<script lang="ts">
	import { privateData } from '../store/store.svelte';
	import { clone } from '$lib/utils/';
	import { savePassword } from '../store/store.svelte';
	import type { PasswordType } from '../private.types';
	import { Star } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	function handleShowPasswordDetails(passwordid: string) {
		privateData.passwordDetails = clone(privateData.data.passwords[passwordid]);
	}

	async function handleUpdateFavorite(formData: FormData, password: PasswordType) {
		privateData.data.passwords[password.passwordid].favorite =
			!privateData.data.passwords[password.passwordid].favorite;
		await savePassword(formData, password);
	}

	const {
		password
	}: {
		password: PasswordType;
	} = $props();
</script>

<div
	tabindex="0"
	role="button"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') handleShowPasswordDetails(password.passwordid);
	}}
	onclick={() => handleShowPasswordDetails(password.passwordid)}
	class="flex items-center gap-6 rounded-2xl p-4 py-5 hover:bg-black/15"
	class:!bg-[#0a0a0a]={privateData.passwordDetails.passwordid === password.passwordid}
>
	<div class="h-[55px] w-[55px] overflow-hidden rounded-full">
		<div
			class="contain h-full w-full"
			style={`background-image:url('https://img.logo.dev/${new URL(password.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:55px; background-position:50%`}
		></div>
	</div>
	<div class="flex flex-1 flex-col">
		<div class="text-left text-xl font-semibold tracking-wider">
			{password.company_name}
		</div>
		<div class="text-left text-sm tracking-wider text-white/70">
			{password.url.replace('https://', '')}
		</div>
	</div>
	<div class="flex items-center">
		<form
			action="/private?/modifyData"
			use:enhance={({ formData }) => handleUpdateFavorite(formData, password)}
			method="POST"
		>
			<button type="submit" onclick={(event) => event.stopPropagation()}>
				<Star
					size="22"
					class="mt-1 text-white/80 hover:text-white"
					fill={password.favorite ? '#fff' : 'transparent'}
				/>
			</button>
		</form>
	</div>
</div>

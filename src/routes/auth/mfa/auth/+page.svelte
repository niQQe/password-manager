<script lang="ts">
	import { goto } from '$app/navigation';
	import { SquareAsterisk } from 'lucide-svelte';
	import Loader from '$lib/components/ui/loader/loader.svelte';
	import CodeInput from '../CodeInput.svelte';
	const { data: propsData } = $props() as any;

	let invalidCode = $state(false);
	let loading = $state(false);

	async function verifyOTP(verifyCode: string) {
		invalidCode = false;
		loading = true;
		const factors = await propsData.supabase.auth.mfa.listFactors();
		if (factors.error) {
			throw factors.error;
		}

		const totpFactor = factors.data.totp[0];

		if (!totpFactor) {
			throw new Error('No TOTP factors found!');
		}

		const factorId = totpFactor.id;

		const challenge = await propsData.supabase.auth.mfa.challenge({ factorId });
		if (challenge.error) {
			throw challenge.error;
		}

		const challengeId = challenge.data.id;

		const verify = await propsData.supabase.auth.mfa.verify({
			factorId,
			challengeId,
			code: verifyCode
		});
		if (verify.error) {
			invalidCode = true;
			loading = false;
		} else {
			const res = await fetch('/api/smfa/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: true })
			});
			console.log(res);
			goto('/private');
		}
	}
</script>

<div class="relative flex max-w-[500px] flex-col gap-3">
	<div class="flex w-full justify-center">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-full"
			style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%);box-shadow:0px 0px 14px 0px #ffffff4d"
		>
			<SquareAsterisk size="26" class="text-white" />
		</div>
	</div>

	<div class="mb-5 flex flex-col gap-2 text-white">
		<div class="text-center text-3xl font-semibold">Two factor authentication</div>
		<div class="text-center text-sm text-white/70">
			Please enter the 6-digit code from your authenticator app.
		</div>
	</div>
	<CodeInput {invalidCode} verifyOTP={(code: string) => verifyOTP(code)} />
	{#if loading}
		<div class="absolute bottom-[-100px] left-0 mt-3 w-full text-center text-red-500">
			<Loader />
		</div>
	{/if}
	{#if invalidCode && !loading}
		<div class="absolute bottom-[-50px] left-0 mt-3 w-full text-center text-red-500">
			Invalid code
		</div>
	{/if}
</div>

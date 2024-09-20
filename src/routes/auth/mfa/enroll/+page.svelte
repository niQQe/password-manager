<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import CodeInput from '../CodeInput.svelte';
	import { SquareAsterisk } from 'lucide-svelte';
	import Loader from '$lib/components/ui/loader/loader.svelte';
	const { data: propsData } = $props() as any;

	let totpData: any = $state();
	let invalidCode = $state(false);
	let verifyIsPending = $state(false);
	let enrollIsPending = $state(false);

	async function enrollMFA() {
		enrollIsPending = true;
		const { data } = (await propsData.supabase.auth.mfa.enroll({
			factorType: 'totp'
		})) as any;
		totpData = data;
		enrollIsPending = false;
	}

	async function verifyOTP(verifyCode: string) {
		invalidCode = false;
		verifyIsPending = true;
		const challenge = await propsData.supabase.auth.mfa.challenge({ factorId: totpData.id });
		if (challenge.error) {
			throw challenge.error;
		}
		60;

		const challengeId = challenge.data.id;

		const verify = await propsData.supabase.auth.mfa.verify({
			factorId: totpData.id,
			challengeId,
			code: verifyCode
		});
		if (verify.error) {
			invalidCode = true;
			verifyIsPending = false;
			throw verify.error;
		} else {
			goto('/private/passwords');
		}
	}

	onMount(async () => {
		await enrollMFA();
	});
</script>

<div class="relative flex max-w-[500px] flex-col items-center gap-3">
	<div class="flex flex-col gap-6 rounded-2xl">
		<div class="flex w-full justify-center">
			<div
				class="flex h-14 w-14 items-center justify-center rounded-full"
				style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%);box-shadow:0px 0px 14px 0px #ffffff4d"
			>
				<SquareAsterisk size="26" class="text-white" />
			</div>
		</div>

		<div class="mb-5 flex flex-col gap-2">
			<div class="text-center text-3xl font-semibold text-white">
				Setup two factor authentication
			</div>
			<div class="flex justify-center">
				<div class="max-w-[350px] text-center text-sm text-white/50">
					To finalize the signup process, you add two factor authentication to your account.
				</div>
			</div>
		</div>
		<div class="flex justify-center">
			<div
				class="flex max-h-[200px] min-h-[200px] min-w-[200px] max-w-[200px] items-center justify-center rounded-lg border border-white/10"
			>
				{#if enrollIsPending}
					<Loader />
				{:else}
					<img
						class="h-full w-full"
						src={totpData?.totp?.qr_code}
						alt="Scan with Google Authenticator"
					/>
				{/if}
			</div>
		</div>
		<div class="mb-4 flex justify-center">
			<div class="w-full max-w-[300px] text-center text-sm text-white/70">
				Scan the QR Code with your authenticator app and enter the 6-digit number produced.
			</div>
		</div>
		<CodeInput {invalidCode} verifyOTP={(code: string) => verifyOTP(code)} />
	</div>
	{#if verifyIsPending}
		<div class="absolute bottom-[-100px] left-0 mt-3 w-full text-center text-red-500">
			<Loader />
		</div>
	{/if}
	{#if invalidCode && !verifyIsPending}
		<div class="absolute bottom-[-50px] left-0 mt-3 w-full text-center text-red-500">
			Invalid code
		</div>
	{/if}
</div>

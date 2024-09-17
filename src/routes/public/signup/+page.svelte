<script lang="ts">
	import { goto } from '$app/navigation';
	import { PasswordMeter } from 'password-meter';
	import type { IResult } from 'password-meter';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { SquareAsterisk } from 'lucide-svelte';

	let signUpForm = $state({
		email: '',
		masterPassword: ''
	});

	let emailExists = $state(false);
	let emailInput = $state<HTMLInputElement | null>(null);
	let passwordInput = $state<HTMLInputElement | null>(null);
	let currentSignUpStep = $state('email');

	let focusTimeout: any = null;

	const passwordStatus: () => IResult = $derived(() =>
		new PasswordMeter().getResult(signUpForm.masterPassword)
	);

	const passwordStatusColors = $derived(() => {
		const percent = passwordStatus().percent;
		if (percent < 20) return 'bg-red-500';
		if (percent < 40) return 'bg-yellow-500';
		if (percent < 60) return 'bg-green-500';
		if (percent <= 100) return 'bg-amber-500';
	});

	$effect(() => {
		(async () => {
			if (currentSignUpStep === 'masterPassword') {
				if (passwordInput) {
					await tick();
					clearTimeout(focusTimeout);
					focusTimeout = setTimeout(() => {
						passwordInput!.focus();
					}, 500);
				}
			}
			if (currentSignUpStep === 'email') {
				if (emailInput) {
					await tick();
					clearTimeout(focusTimeout);
					focusTimeout = setTimeout(() => {
						emailInput!.focus();
					}, 500);
				}
			}
		})();
	});

	function handleCheckEmail(formData: FormData) {
		formData.set('email', signUpForm.email);
		return async ({ result }: { result: any }) => {
			if (result.data.emailExists) {
				emailExists = true;
			} else {
				currentSignUpStep = 'masterPassword';
			}
		};
	}

	function handleSignUp(formData: FormData) {
		formData.set('email', signUpForm.email);
		formData.set('master_password', signUpForm.masterPassword);
		return async ({ result }: { result: any }) => {
			if (result.data.success) {
				goto('/auth/mfa/enroll');
			}
		};
	}
</script>

<div
	class="flex h-[100vh] transform overflow-hidden bg-[#050505] text-white transition-all duration-500"
	id="wrapper"
>
	<div
		class="flex min-w-[100%] transition-all duration-500"
		style={`transform:translateX(${currentSignUpStep === 'email' ? '0%' : '-100%'})`}
	>
		<div
			class="flex w-full min-w-[100%] transition-all duration-200"
			style={` opacity:${currentSignUpStep === 'email' ? '1' : '0'}`}
		>
			<div class="m-auto flex w-[400px] flex-col gap-8">
				<div class="flex w-full flex-col gap-8">
					<div class="flex justify-center">
						<div
							class="flex h-[50px] w-[50px] items-center justify-center rounded-full"
							style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%);box-shadow:0px 0px 14px 0px #ffffff4d"
						>
							<SquareAsterisk size="20" class="text-white" />
						</div>
					</div>
					<div class="flex flex-col gap-3">
						<div class="text-center text-3xl">Glad you decided to join us!</div>
						<div class="text-center text-sm text-white/80">
							Lets start by entering your email below.
						</div>
					</div>
					<div class="mt-4 flex flex-col gap-8">
						<div class="flex w-full flex-col items-start gap-8">
							<form
								action="/public/signup?/checkEmail"
								method="POST"
								class="flex w-full flex-col gap-8"
								use:enhance={({ formData }) => handleCheckEmail(formData)}
							>
								<div class="relative flex w-full flex-col text-white">
									<label for="email" class="text-sm text-white/70">Email</label>
									<input
										bind:value={signUpForm.email}
										bind:this={emailInput}
										type="email"
										placeholder="john@doe.com"
										class="h-[40px] !w-full border-b border-b-white/20 bg-transparent transition-all focus:!border-[#4cc3a4]"
										id="email"
									/>
									{#if emailExists}
										<div
											class="absolute bottom-[-28px] w-full text-center text-sm font-medium text-red-500"
										>
											Email already exist
										</div>
									{/if}
								</div>
								<button
									style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
									class="mt-5 w-full rounded-xl p-4 text-white"
									type="submit">Continue</button
								>
							</form>
							<div class="flex w-full text-center text-sm">
								<div class="w-full text-center text-white/50">
									Already have an account? <a class="text-white" href="/public/signin">Sign in</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="flex w-full min-w-[100%] transition-all duration-200"
			style={` opacity:${currentSignUpStep === 'masterPassword' ? '1' : '0'}`}
		>
			<div class="m-auto flex w-[400px] flex-col gap-8">
				<div class="flex justify-center">
					<div
						class="flex h-[50px] w-[50px] items-center justify-center rounded-full"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%);box-shadow:0px 0px 14px 0px #ffffff4d"
					>
						<SquareAsterisk size="20" class="text-white" />
					</div>
				</div>
				<div class="flex flex-col gap-3">
					<div class="text-center text-3xl">Select a Master Password</div>
					<div class="text-center text-sm text-white/80">
						Use a mix of letters, numbers, and symbols for a secure password. Avoid common words and
						personal info.
					</div>
				</div>
				<div class="mt-4 flex flex-col gap-8">
					<form
						action="/public/signup?/signUp"
						method="POST"
						use:enhance={({ formData }) => handleSignUp(formData)}
					>
						<div class="flex w-full flex-col items-start gap-8">
							<div class="flex w-full flex-col text-white">
								<label for="password" class="text-sm text-white/70">Master password</label>
								<input
									bind:value={signUpForm.masterPassword}
									bind:this={passwordInput}
									type="password"
									placeholder="Enter password"
									class="h-[40px] !w-full border-b border-b-white/20 bg-transparent transition-all focus:!border-[#4cc3a4]"
									id="password"
								/>
							</div>

							<div class="flex w-full flex-col gap-3">
								<div class="flex flex-col gap-2 rounded-xl border border-white/[2%] p-2 px-3 pb-4">
									<div class="text-sm font-medium">
										Password strength: {passwordStatus().percent}%
									</div>
									<div class="h-[3px] w-full bg-white/10">
										<div
											class={`h-[3px] rounded-full transition-all ${passwordStatusColors()}`}
											style={`width: ${passwordStatus().percent}%`}
										></div>
									</div>
								</div>
								<button
									type="submit"
									style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
									class="mt-5 w-full rounded-xl p-4 text-white">Continue</button
								>
							</div>
							<div class="flex w-full text-center text-sm">
								<div class="w-full text-center text-white/50">
									Wrong email? <button
										class="text-white"
										onclick={() => (currentSignUpStep = 'email')}>Back</button
									>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>

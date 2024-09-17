<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { SquareAsterisk } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import GoogleLogo from '$lib/assets/google-logo.svg';
	import GithubLogo from '$lib/assets/github-logo.svg';
	import { tick } from 'svelte';

	const { data: propsData } = $props();
	let checked: boolean = $state(false);
	let masterPassword = $state('');
	let email = $state('');

	let emailInput: HTMLInputElement | null = $state(null);

	$effect(() => {
		(async () => {
			if (emailInput) {
				await tick();
				emailInput?.focus();
			}
		})();
	});

	let signInForm = $state({
		email: '',
		masterPassword: ''
	});

	async function handleSignIn(formData: FormData) {
		formData.set('email', signInForm.email);
		formData.set('master_password', signInForm.masterPassword);
		return async ({ result }: any) => {
			if (result.data.success) {
				try {
					const { data, error } =
						await propsData.supabase.auth.mfa.getAuthenticatorAssuranceLevel();
					if (error) {
						throw error;
					}
					if (data.currentLevel === 'aal1' && data.nextLevel === 'aal1') {
						goto('/auth/mfa/enroll');
					} else if (data.nextLevel === 'aal2' && data.nextLevel !== data.currentLevel) {
						console.log(data);
						goto('/auth/mfa/auth');
					} else {
						goto('/private');
					}
				} finally {
				}
			}
		};
	}
</script>

<div class="flex h-[100vh] w-full bg-[#050505] text-white">
	<!-- <div class="flex w-full items-center text-sm">
			<div class="ml-auto flex items-center gap-6">
				<div class="">New to password manager?</div>
				<button class="rounded bg-blue-200 py-3" onclick={() => (createAccount = true)}
					>Create an account</button
				>
			</div>
		</div> -->
	<div class="flex w-[50%] flex-1 items-center justify-center">
		<div class="flex w-full max-w-[400px] flex-col gap-8">
			<div class="flex flex-col gap-6">
				<div class="flex justify-center">
					<div
						class="flex h-[50px] w-[50px] items-center justify-center rounded-full"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%);box-shadow:0px 0px 14px 0px #ffffff4d"
					>
						<SquareAsterisk size="20" class="text-white" />
					</div>
				</div>
				<div class="flex flex-col gap-2">
					<div class="text-center text-[30px] font-semibold text-white">
						Welcome back to CipherNest
					</div>
					<div class="text-center text-[18.5px] text-white/50">
						Enter you username and password to continue
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-6">
				<form
					action="/public/signin?/signIn"
					method="POST"
					class="flex gap-3"
					use:enhance={({ formData }) => handleSignIn(formData)}
				>
					<div class="flex w-full flex-col items-start gap-6">
						<div class="flex w-full flex-col gap-6">
							<div class="flex w-full flex-col">
								<label for="email" class="text-sm text-white/70">Email</label>
								<input
									bind:value={signInForm.email}
									bind:this={emailInput}
									type="email"
									required
									placeholder="john@doe.com"
									class="h-[40px] !w-full border-b border-b-white/20 bg-transparent transition-all focus:!border-[#4cc3a4]"
									id="email"
								/>
							</div>
							<div class="flex w-full flex-col">
								<label for="password" class="text-sm text-white/70">Password</label>
								<input
									bind:value={signInForm.masterPassword}
									required
									placeholder="Enter password"
									class="h-[40px] !w-full border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
									id="password"
								/>
							</div>
						</div>
						<div class="flex w-full justify-between">
							<div class="flex items-center space-x-2 text-white/70">
								<Checkbox id="terms" bind:checked />
								<Label
									id="terms-label"
									for="terms"
									class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Remember me
								</Label>
							</div>
							<div class="text-sm">Forgot password</div>
						</div>
						<button
							style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
							class="mt-5 w-full rounded-xl p-4 text-white"
							type="submit">Sign in</button
						>
						<div class="flex w-full items-center gap-5">
							<div class="h-[1px] flex-1 bg-white/10"></div>
							<div class="text-sm text-white/60">Or login with</div>
							<div class="h-[1px] flex-1 bg-white/10"></div>
						</div>
						<div class="flex w-full justify-between gap-3">
							<button class="flex flex-1 justify-center rounded-lg border border-white/10 py-2">
								<div class="flex items-center gap-3">
									<img width="30" src={GoogleLogo} alt="Google" />
									Google
								</div>
							</button>
							<button class="flex flex-1 justify-center rounded-lg border border-white/10 py-2">
								<div class="flex items-center gap-3">
									<img width="30" src={GithubLogo} alt="Github" />
									Github
								</div>
							</button>
						</div>
						<div class="flex w-full text-center text-sm">
							<div class="w-full text-center text-white/50">
								Dont have an account? <a class="text-white" href="/public/signup">Register</a>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>

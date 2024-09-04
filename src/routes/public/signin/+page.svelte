<script lang="ts">
	import { enhance } from '$app/forms';
	import { formData } from 'zod-form-data';
	import { goto } from '$app/navigation';

	let masterPassword = $state('');
	let email = $state('');
	let emailExists = $state(false);

	let createAccount = $state(false);
	let showMasterPasswordForm = $state(false);
</script>

<div class="flex h-full w-full justify-end bg-gray-100">
	<div class="w-[500px] bg-white p-6">
		<div class="flex h-full flex-col items-start gap-3">
			{#if !createAccount}
				<div class="flex w-full items-center text-sm">
					<div class="ml-auto flex items-center gap-6">
						<div class="">New to password manager?</div>
						<button class="rounded bg-blue-200 py-3" onclick={() => (createAccount = true)}
							>Create an account</button
						>
					</div>
				</div>
				<div class="mt-[calc(50%)] w-full">
					<div>Sign in</div>
					<form
						action="/public/signin?/signIn"
						method="POST"
						class="flex gap-3 p-3"
						use:enhance={({ formData }) => {
							formData.set('email', email);
							formData.set('master_password', masterPassword);
							return ({ result }: any) => {
								if (result.data.success) {
									goto('/private');
								}
							};
						}}
					>
						<div class="flex w-full flex-col items-start gap-3">
							<input type="text" placeholder="Enter email" bind:value={email} class="w-full" />
							<input
								type="password"
								placeholder="Enter password"
								bind:value={masterPassword}
								class="w-full"
							/>
							<button class="rounded bg-blue-600" type="submit">Sign in</button>
						</div>
					</form>
				</div>
			{:else}
				<div class="flex w-full items-center text-sm">
					<div class="ml-auto flex items-center gap-6">
						<div class="">Already use passwordmanager?</div>
						<button class="rounded bg-blue-200 py-3" onclick={() => (createAccount = false)}
							>Log in</button
						>
					</div>
				</div>
				<div class="mt-[calc(50%)] flex flex-col">
					{#if !showMasterPasswordForm}
						<div>
							Signup
							<form
								action="/public/signin?/checkEmail"
								method="POST"
								class="flex gap-3 p-3"
								use:enhance={({ formData }) => {
									formData.set('email', email);
									return ({ result }: any) => {
										if (result) {
											if (result.data.emailExists) {
												emailExists = true;
												return;
											}
											showMasterPasswordForm = true;
										}
									};
								}}
							>
								<div class="flex flex-col">
									<div class="flex w-full gap-3">
										<input placeholder="email@example.com" type="text" bind:value={email} />
										<button class="rounded bg-blue-600" type="submit">Next</button>
									</div>
									{#if emailExists}
										<p class="text-sm text-red-600">Email already exists</p>
									{/if}
								</div>
							</form>
						</div>
					{:else}
						<div>
							Master password
							<form
								action="/public/signin?/signUp"
								method="POST"
								class="flex gap-3"
								use:enhance={({ formData }) => {
									formData.set('email', email);
									formData.set('master_password', masterPassword);
									return ({ result }: any) => {
										if (result.type === 'success') {
											goto('/private');
										}
									};
								}}
							>
								<input type="password" placeholder="Enter password" bind:value={masterPassword} />
								<button class="rounded bg-blue-600" type="submit">Sign up</button>
							</form>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

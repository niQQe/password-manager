<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import type { PasswordType } from '../private.types';
	import { SquareAsterisk, RectangleEllipsis, Eye, EyeOff } from 'lucide-svelte';
	import { generatePassword } from '$lib/utils/';
	import { savePassword } from '../store/store.svelte';
	import { enhance } from '$app/forms';
	import { Plus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import PasswordStrengthMeasurer from '../components/PasswordStrengthMeasurer.svelte';
	import { privateData } from '../store/store.svelte';
	import dayjs from 'dayjs';

	let open = $state(false);
	let showPassword = $state(false);
	let urlAlreadyExist = $state(false);

	let form = $state({
		passwordid: '',
		company_name: '',
		url: '',
		username: '',
		password: ''
	}) as PasswordType;

	async function handleSavePassword(formData: FormData) {
		await savePassword(formData, form);
		setOpen(false);
		toast.success('Item saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
	}

	function handleUrlInputBlur() {
		if (!form.url.startsWith('http://') && !form.url.startsWith('https://') && form.url !== '') {
			form.url = `https://${form.url}`;
		}

		urlAlreadyExist = Object.values(privateData.data.passwords)
			.map((i) => i.url)
			.includes(form.url);
	}

	function handleGeneratePassword(e: MouseEvent) {
		e.preventDefault();
		form.password = generatePassword();
	}

	function setOpen(value: boolean) {
		open = value;
		for (let key in form) {
			// @ts-ignore
			form[key] = '';
		}
	}
</script>

<Dialog.Root {open} onOpenChange={setOpen}>
	<Dialog.Trigger>
		<button
			onclick={() => (open = true)}
			class="flex h-[48px] min-w-[48px] transform rounded-full transition-all hover:scale-110"
			style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
		>
			<Plus size="24" class="m-auto text-white" stroke="0.2" />
		</button>
	</Dialog.Trigger>
	<Dialog.Content class="min-w-[600px] border-white/[2%] bg-[#0f0f0f]  p-12 sm:max-w-[425px]">
		<Dialog.Header class="mb-4">
			<div class="flex items-center gap-6">
				<div class="flex h-[80px] w-[80px] rounded-full">
					<div
						class="flex h-full w-full rounded-full border-4 border-[#153029]"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
					>
						<SquareAsterisk size="24" class="m-auto text-white" />
					</div>
				</div>
				<div class="flex flex-col">
					<Dialog.Title class="text-2xl"
						>{form.company_name === '' ? 'Company' : form.company_name}</Dialog.Title
					>
					<div class="text-white/80">{form.url === '' ? 'www.example.com' : form.url}</div>
				</div>
			</div>
		</Dialog.Header>
		<div class="flex flex-col gap-10">
			<form
				action="/private?/modifyData"
				method="POST"
				class="flex flex-col gap-6"
				use:enhance={({ formData }) => handleSavePassword(formData)}
			>
				<div class="relative flex flex-col">
					<label for="company_form" class="text-sm text-white/70">Company</label>
					<input
						placeholder="Company name"
						required
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						bind:value={form.company_name}
						id="company_form"
						type="text"
					/>
				</div>
				<div class="relative flex flex-col">
					<label for="website_form" class="text-sm text-white/70">Website</label>
					<input
						placeholder="www.example.com"
						bind:value={form.url}
						onblur={() => handleUrlInputBlur()}
						required
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						id="website_form"
						type="url"
					/>
					{#if urlAlreadyExist}
						<p class="mt-[5px] text-xs font-medium text-red-500">This website is already added.</p>
					{/if}
				</div>
				<div class="relative flex flex-col">
					<label for="username" class="text-sm text-white/70">Email or username</label>
					<input
						bind:value={form.username}
						required
						placeholder="john@doe.se"
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						id="username"
						autocomplete="username"
						type="text"
					/>
				</div>
				<div class="relative flex flex-col">
					<label for="password_form" class="text-sm text-white/70">Password</label>
					<div class="relative w-full">
						<div class="absolute right-0 top-[3px]">
							<Tooltip.Root>
								<Tooltip.Trigger>
									<button
										onclick={(e) => handleGeneratePassword(e)}
										class="flex border-0 bg-transparent !p-0 text-white/70 hover:text-white"
									>
										<RectangleEllipsis size="24" class="right-0 top-0 m-auto " stroke="0.2" />
									</button>
								</Tooltip.Trigger>
								<Tooltip.Content class=" border-0 bg-black">
									<p class="flex min-w-[130px] text-center text-sm">Generate password</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
						{#if !showPassword}
							<Eye
								onclick={() => (showPassword = true)}
								size="20"
								class="absolute right-9 top-[5px] cursor-pointer text-white/80 hover:text-white"
							/>
						{:else}
							<EyeOff
								onclick={() => (showPassword = false)}
								size="20"
								class="absolute right-9 top-[5px] cursor-pointer text-white/80 hover:text-white"
							/>
						{/if}
						<input
							placeholder="Enter your password"
							required
							bind:value={form.password}
							class="h-[40px] w-full border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
							id="password_form"
							autocomplete="new-password"
							type={showPassword ? 'text' : 'password'}
						/>
					</div>
				</div>
				<PasswordStrengthMeasurer class="mt-4" password={form.password} />
				<div class="flex justify-end">
					<button
						type="submit"
						class="text-md rounded-lg p-3 px-4 font-medium"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
						>Save password</button
					>
				</div>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>

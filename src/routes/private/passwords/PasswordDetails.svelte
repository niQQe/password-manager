<script lang="ts">
	import { enhance } from '$app/forms';
	import { Star, Copy, Eye, EyeOff, Trash, Check, Edit } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { deletePassword, privateData, savePassword } from '../store/store.svelte';
	import { toast } from 'svelte-sonner';
	import { copyToClipboard, clone } from '$lib/utils/';
	import ShareLink from './ShareLink.svelte';
	import PasswordStrengthMeasurer from '../components/PasswordStrengthMeasurer.svelte';
	import dayjs from 'dayjs';
	import type { PasswordType } from '../private.types';

	let showPassword = $state(false);
	let editActive = $state(false);
	let firstInput: null | HTMLInputElement = $state(null);
	let currentSection: 'passwordDetails' | 'shareLink' = $state('passwordDetails');
	let password = $state(privateData.passwordDetails);
	let copied = $state({
		username: false,
		password: false,
		website: false
	}) as Record<string, boolean>;
	let originalPassword = $state();
	let hasChanged = $state(false);

	$effect(() => {
		password = clone(privateData.passwordDetails);
		originalPassword = clone(privateData.passwordDetails);
		showPassword = false;
		currentSection = 'passwordDetails';
		editActive = false;
	});

	$effect(() => {
		hasChanged = JSON.stringify(password) !== JSON.stringify(originalPassword);
	});

	const noPasswords = $derived(() => !Object.keys(privateData.passwordDetails ?? {}).length);

	async function handledeletePassword(formData: FormData) {
		if (!privateData.data.passwords) return;
		await deletePassword(formData, password.passwordid);
		toast.success('password deleted', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});

		privateData.passwordDetails =
			privateData.data.passwords[Object.keys(privateData.data.passwords)[0]];
	}

	function handleSelectSection(section: 'passwordDetails' | 'shareLink') {
		currentSection = section;
		editActive = false;
	}

	async function handleActivateEdit() {
		editActive = !editActive;
		if (editActive) {
			await tick();
			firstInput?.focus();
		} else {
			password = clone(originalPassword) as PasswordType;
		}
	}

	function handleCopyToClipboard(target: string, value: string) {
		copied[target] = true;
		setTimeout(() => {
			copied[target] = false;
		}, 3000);
		copyToClipboard(value);
	}

	async function handleSaveChanges(formData: FormData) {
		await savePassword(formData, password);
		toast.success('password changes saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
		editActive = false;
	}
</script>

<div class="z-[20] flex max-w-[650px] flex-1 flex-col bg-[#0a0a0a] p-6">
	{#if noPasswords()}
		<div class="flex h-full w-full">
			<div class="m-auto flex flex-col gap-2">
				<div class="border-b border-white/10 pb-3 text-center text-2xl font-bold">
					password details
				</div>
				<div class="text-center text-white/70">
					Once you add a password the details will be over here.
				</div>
			</div>
		</div>
	{:else}
		<div class="relative flex flex-1 flex-col gap-6">
			<div class="flex w-full items-center gap-6 p-4">
				<div class="h-[80px] w-[80px] overflow-hidden rounded-full">
					<div
						class="contain h-full w-full"
						style={`background-image:url('https://img.logo.dev/${new URL(password.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:80px; background-position:50%`}
					></div>
				</div>
				<div class="flex flex-col">
					<div class="max-w-250px] flex items-center gap-3 truncate text-3xl font-bold">
						{password.company_name}
						<Star size="22" fill={password.favorite ? '#fff' : 'transparent'} />
					</div>
					<div class="text-lg text-white/80">
						{password.url.replace('https://', '')}
					</div>
				</div>
				<div class="mb-auto ml-auto mt-2 flex items-center gap-2">
					{#if editActive}
						<div class="flex justify-end gap-6">
							<button class="text-white/80 hover:text-white" onclick={() => handleActivateEdit()}
								>Cancel</button
							>
							<form
								action="/private?/modifyData"
								use:enhance={({ formData }) => handleSaveChanges(formData)}
								method="POST"
							>
								<button
									type="submit"
									class={` ${!hasChanged ? 'pointer-events-none opacity-50' : ''} rounded-lg p-2.5 px-3 text-sm font-medium transition-all`}
									style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
									>Save changes</button
								>
							</form>
						</div>
					{:else}
						<button
							onclick={() => handleActivateEdit()}
							class:!bg-[#4cc3a4]={editActive}
							class="rounded-lg p-2 transition-all hover:bg-white/10"><Edit size="20" /></button
						>
						<form
							action="/private?/modifyData"
							use:enhance={({ formData }) => handledeletePassword(formData)}
							class="flex items-center"
							method="POST"
						>
							<button
								class="rounded-lg p-2 text-red-600/80 transition-all hover:bg-red-600/10 hover:text-red-600/90"
								><Trash size="20" /></button
							>
						</form>
					{/if}
				</div>
			</div>
			<div class="px-4">
				<div class="relative flex gap-3 border-b border-white/20 text-[18px]">
					<button
						onclick={() => handleSelectSection('passwordDetails')}
						class={`border-b-2 border-transparent px-4 pb-2 text-white/90 transition-all  hover:text-white ${currentSection === 'passwordDetails' ? '!text-[#4cc3a4]' : ''} `}
						>Details</button
					>
					<button
						onclick={() => handleSelectSection('shareLink')}
						class={`border-b-2  border-transparent  px-4 pb-2 text-white/90 transition-all hover:text-white ${currentSection === 'shareLink' ? ' !text-[#4cc3a4]' : ''} `}
						>Share link</button
					>
					<div
						class={`absolute bottom-0 h-[2px] transition-all ${currentSection === 'passwordDetails' ? 'left-0  w-[88px]' : 'left-[101px] w-[114px]'} bg-[#4cc3a4]`}
					></div>
				</div>
			</div>
			{#if currentSection === 'passwordDetails'}
				<div class="flex w-full flex-col gap-10 p-4">
					<form class="flex flex-col gap-6">
						<div class="relative flex flex-col">
							{#if copied.username}
								<Check size="20" class="absolute right-0 top-6 cursor-pointer text-[#4cc3a4]" />
							{:else}
								<Copy
									size="20"
									class="absolute right-0 top-6 cursor-pointer text-white/80 hover:text-white"
									onclick={() => handleCopyToClipboard('username', password.username)}
								/>
							{/if}
							<label for="username" class="text-sm text-white/70">Username</label>
							<input
								class:pointer-events-none={!editActive}
								bind:this={firstInput}
								class="h-[40px] border-b border-b-white/20 transition-all focus:border-[#4cc3a4]"
								id="username"
								bind:value={password.username}
								type="text"
							/>
						</div>
						<div class="relative flex flex-col">
							{#if copied.password}
								<Check size="20" class="absolute right-0 top-6 cursor-pointer text-[#4cc3a4]" />
							{:else}
								<Copy
									size="20"
									class="absolute right-0 top-6 cursor-pointer text-white/80 hover:text-white"
									onclick={() => handleCopyToClipboard('password', password.password)}
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
							<label for="password" class="text-sm text-white/70">Password</label>
							<input
								class:pointer-events-none={!editActive}
								class="h-[40px] border-b border-b-white/20 transition-all focus:border-[#4cc3a4]"
								id="password"
								bind:value={password.password}
								type={showPassword ? 'text' : 'password'}
							/>
						</div>
						<div class="relative flex flex-col">
							{#if copied.url}
								<Check size="20" class="absolute right-0 top-6 cursor-pointer text-green-500" />
							{:else}
								<Copy
									size="20"
									class="absolute right-0 top-6 z-[10] cursor-pointer text-white/80 hover:text-white"
									onclick={() => handleCopyToClipboard('url', password.url)}
								/>
							{/if}
							<label for="website" class="text-sm text-white/70">Website</label>
							<div class="relative flex flex-1">
								<a
									href={password.url}
									target="_blank"
									class="absolute left-0 top-2 cursor-pointer text-blue-500 underline"
									class:hidden={editActive}
								>
									{password.url}
								</a>
								<input
									class="transition-border h-[40px] w-full border-b border-b-white/20 focus:border-[#4cc3a4]"
									class:!text-[#0a0a0a]={!editActive}
									id="website"
									class:pointer-events-none={!editActive}
									bind:value={password.url}
									type="text"
								/>
							</div>
						</div>
					</form>
					<PasswordStrengthMeasurer password={password.password} />
					<div class="flex flex-col gap-4">
						<div class="flex flex-col gap-1">
							<div class="text-sm font-normal tracking-wide text-white/50">Last Modified</div>
							<div class="text-md font-normal tracking-wide text-white/80">
								{dayjs(password.updated_at).format('MMM DD, YYYY HH:mm')}
							</div>
						</div>
						<div class="flex flex-col gap-1">
							<div class="text-sm font-normal tracking-wide text-white/50">Created</div>
							<div class="text-md font-normal tracking-wide text-white/80">
								{dayjs(password.created_at).format('MMM DD, YYYY HH:mm')}
							</div>
						</div>
					</div>
				</div>
			{/if}
			{#if currentSection === 'shareLink'}
				<ShareLink passwordid={password.passwordid} />
			{/if}
		</div>
	{/if}
</div>

<style>
	input {
		background: transparent;
	}
</style>

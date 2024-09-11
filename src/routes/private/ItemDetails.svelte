<script lang="ts">
	import { enhance } from '$app/forms';
	import { Star, Copy, Eye, EyeOff, SquareAsterisk, Trash, Check } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { deleteItem, privateStates, saveItem } from './store/store.svelte';
	import { toast } from 'svelte-sonner';
	import ShareLink from './ShareLink.svelte';
	import { PasswordMeter } from 'password-meter';
	import type { IResult } from 'password-meter';
	import { copyToClipboard } from '$lib/utils/';
	import dayjs from 'dayjs';

	const {
		openItemDetails
	}: {
		setOpenItemDetails: (value: boolean) => void;
		openItemDetails: boolean;
	} = $props();

	let showPassword = $state(false);
	let open = $state(openItemDetails);
	let editActive = $state(false);
	let firstInput: null | HTMLInputElement = $state(null);
	let currentSection: 'itemDetails' | 'shareLink' = $state('itemDetails');
	let item = $state(privateStates.itemDetails);
	let copied = $state({
		username: false,
		password: false,
		website: false
	}) as Record<string, boolean>;

	type strengthDictType = {
		veryWeak: { status: string; class: string };
		weak: { status: string; class: string };
		medium: { status: string; class: string };
		strong: { status: string; class: string };
		veryStrong: { status: string; class: string };
		perfect: { status: string; class: string };
	};

	type StrengthKey = keyof strengthDictType;

	let strengthDict: strengthDictType = {
		veryWeak: {
			status: 'Very weak',
			class: 'text-red-500'
		},
		weak: {
			status: 'Weak',
			class: 'text-orange-500'
		},
		medium: {
			status: 'Decent',
			class: 'text-yellow-500'
		},
		strong: {
			status: 'Strong',
			class: 'text-lime-500'
		},
		veryStrong: {
			status: 'Very strong',
			class: 'text-green-500'
		},
		perfect: {
			status: 'Ultimate!',
			class: 'text-amber-500 glow'
		}
	};

	$effect(() => {
		item = privateStates.itemDetails;
		showPassword = false;
		currentSection = 'itemDetails';
		editActive = false;
	});

	$effect(() => {
		open = openItemDetails;
	});

	const passwordStatus: () => IResult = $derived(() =>
		new PasswordMeter().getResult(item.password)
	);

	async function handleDeleteItem(formData: FormData) {
		await deleteItem(formData, item.itemid);
		toast.success('Item deleted', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});

		privateStates.itemDetails = privateStates.items[Object.keys(privateStates.items)[0]];
	}

	function handleSelectSection(section: 'itemDetails' | 'shareLink') {
		currentSection = section;
		editActive = false;
	}

	async function handleActivateEdit() {
		editActive = !editActive;
		if (editActive) {
			await tick();
			firstInput?.focus();
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
		await saveItem(formData, item);
		toast.success('Item changes saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
		editActive = false;
	}
</script>

<div class="flex flex-1 max-w-[650px] flex-col bg-[#0a0a0a] p-6">
	<div class="relative flex flex-1 flex-col gap-6">
		<div class="absolute right-10 top-10 flex items-center gap-3">
			<button
				onclick={() => handleActivateEdit()}
				class:!bg-[#4cc3a4]={editActive}
				class="h-[32px] rounded-lg bg-[#292929] px-4 transition-all hover:bg-[#393939]">Edit</button
			>
			<form
				action="/private?/modifyItem"
				use:enhance={({ formData }) => handleDeleteItem(formData)}
				class="flex items-center"
				method="POST"
			>
				<button
					class="h-[32px] rounded-lg bg-red-600/10 px-2 text-red-600/80 transition-all hover:bg-red-600/20 hover:text-red-600/90"
					><Trash size="16" /></button
				>
			</form>
		</div>
		<div class="flex w-full items-center gap-6 p-4">
			<div class="h-[80px] w-[80px] overflow-hidden rounded-full">
				{#if item.ogData.logo}
					<div
						class="contain h-full w-full"
						style={`background-image:url(${item.ogData.logo});background-size:cover; background-position:50%`}
					></div>
				{:else}
					<div
						class="flex h-full w-full rounded-full border-4 border-[#153029]"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
					>
						<SquareAsterisk size="24" class="m-auto text-white" />
					</div>
				{/if}
			</div>
			<div class="flex flex-col">
				<div class="flex max-w-[200px] items-center gap-3 truncate text-3xl font-bold">
					{item.company_name}
					<Star size="22" fill="#fff" />
				</div>
				<div class="text-lg text-white/80">
					{item.url}
				</div>
			</div>
		</div>
		<div class="px-4">
			<div class="relative flex gap-3 border-b border-white/20 text-[18px]">
				<button
					onclick={() => handleSelectSection('itemDetails')}
					class={`border-b-2 border-transparent px-4 pb-2 text-white/90 transition-all  hover:text-white ${currentSection === 'itemDetails' ? '!text-[#4cc3a4]' : ''} `}
					>Details</button
				>
				<button
					onclick={() => handleSelectSection('shareLink')}
					class={`border-b-2  border-transparent  px-4 pb-2 text-white/90 transition-all hover:text-white ${currentSection === 'shareLink' ? ' !text-[#4cc3a4]' : ''} `}
					>Share link</button
				>
				<div
					class={`absolute bottom-0 h-[2px] transition-all ${currentSection === 'itemDetails' ? 'left-0  w-[88px]' : 'left-[101px] w-[114px]'} bg-[#4cc3a4]`}
				></div>
			</div>
		</div>
		{#if currentSection === 'itemDetails'}
			<div class="flex w-full flex-col gap-10 p-4">
				<form class="flex flex-col gap-6">
					<div class="relative flex flex-col">
						{#if copied.username}
							<Check size="20" class="absolute right-0 top-6 cursor-pointer text-green-500" />
						{:else}
							<Copy
								size="20"
								class="absolute right-0 top-6 cursor-pointer text-white/80 hover:text-white"
								onclick={() => handleCopyToClipboard('username', item.username)}
							/>
						{/if}
						<label for="username" class="text-sm text-white/70">Username</label>
						<input
							class:pointer-events-none={!editActive}
							bind:this={firstInput}
							class="h-[40px] border-b border-b-white/20 transition-all focus:border-[#4cc3a4]"
							id="username"
							bind:value={item.username}
							type="text"
						/>
					</div>
					<div class="relative flex flex-col">
						{#if copied.password}
							<Check size="20" class="absolute right-0 top-6 cursor-pointer text-green-500" />
						{:else}
							<Copy
								size="20"
								class="absolute right-0 top-6 cursor-pointer text-white/80 hover:text-white"
								onclick={() => handleCopyToClipboard('password', item.password)}
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
							bind:value={item.password}
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
								onclick={() => handleCopyToClipboard('url', item.url)}
							/>
						{/if}
						<label for="website" class="text-sm text-white/70">Website</label>
						<div class="relative flex flex-1">
							<a
								href={item.url}
								target="_blank"
								class="absolute left-0 top-2 cursor-pointer text-blue-500 underline"
								class:hidden={editActive}
							>
								{item.url}
							</a>
							<input
								class="transition-border h-[40px] w-full border-b border-b-white/20 focus:border-[#4cc3a4]"
								class:!text-[#0a0a0a]={!editActive}
								id="website"
								class:pointer-events-none={!editActive}
								bind:value={item.url}
								type="text"
							/>
						</div>
					</div>
					<div class="relative flex flex-col items-start gap-2">
						<label for="category" class="text-sm text-white/70">Category</label>
						<div class="rounded bg-[#2b2b2b] p-1.5 px-3 text-xs text-yellow-600">Default</div>
					</div>
				</form>
				<div class="flex items-center gap-[40px]">
					<div class="relative flex h-[160px] w-[160px]">
						<div class="m-auto text-[32px] font-medium">{passwordStatus().percent}%</div>
						<div
							class="absolute left-[3px] top-[3px] h-[154px] w-[154px] rounded-full border-[14px] border-green-600/[5%]"
						></div>
						<svg
							width="160"
							height="160"
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
								stroke-dashoffset={439.6 * (1 - passwordStatus().percent / 100)}
							></circle>
							<defs>
								<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stop-color="#05a" />
									<stop offset="100%" stop-color="#0a5" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<div class="flex flex-col gap-1 tracking-wide">
						<div class="text-[20px]">
							Password score: {passwordStatus().score}<span></span>
						</div>
						<div class="text-widest text-sm">
							Password strength: <span
								class={`${strengthDict[passwordStatus().status as StrengthKey].class} `}
								>{strengthDict[passwordStatus().status as StrengthKey].status}</span
							>
						</div>
						<div class="text-wider text-sm font-semibold text-blue-400">Get new suggestion?</div>
					</div>
				</div>
				<div class="flex flex-col gap-6">
					<div class="flex flex-col gap-1">
						<div class="text-sm font-normal tracking-wide text-white/50">Last Modified</div>
						<div class="text-md font-normal tracking-wide text-white/80">{item.updated_at}</div>
					</div>
					<div class="flex flex-col gap-1">
						<div class="text-sm font-normal tracking-wide text-white/50">Created</div>
						<div class="text-md font-normal tracking-wide text-white/80">{item.created_at}</div>
					</div>
				</div>
			</div>
		{/if}
		{#if currentSection === 'shareLink'}
			<ShareLink itemid={item.itemid} />
		{/if}
		{#if editActive}
			<div class="flex justify-end px-6">
				<form
					action="/private?/modifyItem"
					use:enhance={({ formData }) => handleSaveChanges(formData)}
					method="POST"
				>
					<button
						type="submit"
						class="text-md rounded-lg p-3 px-4 font-medium"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
						>Save changes</button
					>
				</form>
			</div>
		{/if}
	</div>
</div>

<style>
	input {
		background: transparent;
	}

	.glow {
		text-align: center;
		-webkit-animation: glow 1s ease-in-out infinite alternate;
		-moz-animation: glow 1s ease-in-out infinite alternate;
		animation: glow 1s ease-in-out infinite alternate;
		text-shadow: 0 0 8px #ebcf02;
	}
</style>

<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ItemType } from './private.types';
	import { SquareAsterisk } from 'lucide-svelte';
	import { saveItem } from './store/store.svelte';
	import { enhance } from '$app/forms';
	import { Plus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import dayjs from 'dayjs';

	let open = $state(false);

	let form = $state({
		itemid: '',
		company_name: '',
		url: 'www.example.com',
		username: '',
		password: ''
	}) as ItemType;

	async function handleSavePassword(formData: FormData) {
		await saveItem(formData, form);
		setOpen(false);
		toast.success('Item saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
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
	<Dialog.Content class="min-w-[500px] p-12 !rounded-3xl border-white/10  bg-[#0a0a0a] sm:max-w-[425px]">
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
					<Dialog.Title class="text-2xl">Company</Dialog.Title>
					<div class="text-white/80">john@doe.com</div>
				</div>
			</div>
		</Dialog.Header>
		<div class="flex flex-col gap-10">
			<form class="flex flex-col gap-6">
				<div class="relative flex flex-col">
					<label for="company" class="text-sm text-white/70">Company</label>
					<input
						placeholder="Company name"
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						bind:value={form.company_name}
						id="company"
						type="text"
					/>
				</div>
				<div class="relative flex flex-col">
					<label for="website" class="text-sm text-white/70">Website</label>
					<input
						placeholder="www.example.com"
						bind:value={form.url}
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						id="website"
						type="text"
					/>
				</div>
				<div class="relative flex flex-col">
					<label for="username" class="text-sm text-white/70">Email or username</label>
					<input
						bind:value={form.username}
						placeholder="john@doe.se"
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						id="username"
						type="text"
					/>
				</div>
				<div class="relative flex flex-col">
					<label for="password" class="text-sm text-white/70">Password</label>
					<input
						placeholder="Enter your password"
						bind:value={form.password}
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						id="password"
						type="password"
					/>
				</div>
			</form>
			<div class="flex items-center gap-[30px]">
				<div class="relative flex h-[120px] w-[120px]">
					<div class="m-auto text-[26px] font-medium">82%</div>
					<div
						class="absolute left-[+px] top-[0px] h-[120px] w-[120px] rounded-full border-[14px] border-green-600/[5%]"
					></div>
					<svg
						width="120"
						height="120"
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
							stroke-linecap="round"
							stroke-width="14px"
							stroke-dasharray="439.6px"
							stroke-dashoffset="109.9px"
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
					<div class="text-[18px]">Password score: 82%</div>
					<div class="text-widest text-sm text-white/60">
						Password strength: <span class="text-green-300">Good</span>
					</div>
					<div class="text-wider text-sm font-semibold text-blue-400">Get new suggestion?</div>
				</div>
			</div>
		</div>
		<Dialog.Footer class="mt-4">
			<form
				action="/private?/modifyItem"
				method="POST"
				use:enhance={({ formData }) => handleSavePassword(formData)}
			>
				<button
					type="submit"
					class="text-md rounded-lg p-3 px-4 font-medium"
					style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
					>Save password</button
				>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

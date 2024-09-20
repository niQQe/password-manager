<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ItemType } from '../private.types';
	import * as Tabs from '$lib/components/ui/tabs';
	let {
		item,
		open,
		setOpenChangePasswordModal
	}: { item: ItemType; open: boolean; setOpenChangePasswordModal: (value: boolean) => void } =
		$props();
</script>

<Dialog.Root {open} onOpenChange={setOpenChangePasswordModal}>
	<Dialog.Content class="min-w-[700px] border-white/[2%] bg-[#0f0f0f]  p-12 sm:max-w-[425px]">
		<Dialog.Header class="mb-4 flex flex-col gap-2 text-xl">
			Change your password

			<div class="text-sm text-white/60">
				This will only take a few minutes, and we’re here to help.
			</div>
		</Dialog.Header>
		<div class="flex flex-col items-start gap-6 text-sm">
			<div class="flex items-center gap-4">
				<div
					class="flex h-[35px] min-w-[35px] max-w-[35px] items-center justify-center rounded-full bg-white/[5%]"
				>
					1
				</div>
				<div class="flex w-full">
					Go to <div
						class="mx-3 h-[25px] w-[25px] overflow-hidden rounded-full"
						style={`background-image:url('https://img.logo.dev/${new URL(item.url).hostname}?token=pk_JJAmWTSNT82ETdhZr1Ab8w');background-size:contain;background-size:25px; background-position:50%`}
					></div>
					<span class="font-semibold">{item.url.replace('https://', '')}</span>, if you are logged
					out. log in.
				</div>
			</div>
			<div class="flex items-center gap-4">
				<div class="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-white/[5%]">
					2
				</div>
				<div>Then, go to the account settings to change password.</div>
			</div>
			<div class="flex items-center gap-4">
				<div
					class="flex h-[35px] w-[35px] min-w-[35px] items-center justify-center rounded-full bg-white/[5%]"
				>
					3
				</div>
				<div>
					CipherNest will automatically prompt to replace your password — quickly and securely.
				</div>
			</div>
			<div class="flex w-full justify-end gap-3">
				<button
					onclick={() => setOpenChangePasswordModal(false)}
					class="rounded-lg p-2.5 px-3 hover:bg-white/10"
				>
					Not now
				</button>
				<button
					onclick={() => window.open(item.url, '_blank')}
					class="rounded-lg p-2.5 px-3 text-sm font-medium transition-all"
					style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
					>Go to {item.url.replace('https://', '')}</button
				>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

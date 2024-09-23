<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';

	const {
		open,
		setOpenAddNoteModal
	}: {
		open: boolean;
		setOpenAddNoteModal: (value: boolean) => void;
	} = $props();

	let form = $state({
		noteid: null,
		title: '',
		note: ''
	});

	function handleClose(e: MouseEvent) {
		e.preventDefault();
		setOpenAddNoteModal(false);
	}

	async function handleSaveBankCard(formData: FormData) {
		// await saveNote(formData, form);
		// setOpenAddNoteModal(false);
		// toast.success('Item saved', {
		// 	description: dayjs().format('D MMM, YYYY HH:mm')
		// });
	}
</script>

<Dialog.Root {open} onOpenChange={setOpenAddNoteModal}>
	<Dialog.Content class="max-w-[400px] border-white/[2%] bg-[#0f0f0f]  p-12">
		<Dialog.Header class="mb-4 flex flex-row items-center gap-3 text-xl">
			<div>Add bank card</div>
		</Dialog.Header>
		<div class="flex w-full flex-col gap-10">
			<form
				action="/private?/modifyData"
				method="POST"
				class="grid w-full grid-cols-1 flex-col items-start gap-6"
				use:enhance={({ formData }) => handleSaveBankCard(formData)}
			>
				<div class="relative flex flex-col">
					<label for="title" class="text-sm text-white/70">Title</label>
					<input
						placeholder="Title of your note"
						required
						class="text-md h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						bind:value={form.title}
						id="title"
						type="text"
					/>
				</div>
				<div class="relative flex flex-col">
					<label for="title" class="text-sm text-white/70">Card number</label>
					<input
						required
						type="tele"
						class="text-md h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						bind:value={form.title}
						id="title"
						pattern="[0-9\s]"
						autocomplete="cc-number"
						maxlength="19"
						inputmode="numeric"
						placeholder="xxxx xxxx xxxx xxxx"
					/>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="relative flex flex-col">
						<label for="title" class="text-sm text-white/70">Expiry date</label>
						<input
							placeholder="Title of your note"
							required
							class="text-md h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
							bind:value={form.title}
							id="title"
							type="text"
						/>
					</div>
					<div class="relative flex flex-col">
						<label for="title" class="text-sm text-white/70">Card number</label>
						<input
							placeholder="Title of your note"
							required
							class="text-md h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
							bind:value={form.title}
							id="title"
							type="text"
						/>
					</div>
				</div>
				<div class="flex justify-end gap-3">
					<button
						onclick={(e) => handleClose(e)}
						class="text-md rounded-lg p-3 px-4 font-medium hover:bg-white/[5%]">Cancel</button
					>
					<button
						type="submit"
						class="text-md rounded-lg p-3 px-4 font-medium"
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
						>Save note</button
					>
				</div>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>

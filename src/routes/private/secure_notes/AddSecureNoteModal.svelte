<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { NoteType } from '../private.types';
	import { saveNote, deleteNote } from '../store/store.svelte';
	import { Trash } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import dayjs from 'dayjs';
	import { privateData } from '../store/store.svelte';

	const {
		open,
		noteid,
		setOpen
	}: {
		open: boolean;
		noteid?: string | null;
		setOpen: (value: boolean) => void;
	} = $props();

	let form = $state({
		noteid: null,
		title: '',
		note: ''
	}) as NoteType;

	$effect(() => {
		if (open) {
			form = {
				noteid: null,
				title: privateData.data.notes[noteid ?? '']?.title ?? '',
				note: privateData.data.notes[noteid ?? '']?.note ?? ''
			} as NoteType;
		}
	});

	async function handleDeleteNote(formData: FormData) {
		console.log(noteid);
		if (!noteid) return;
		await deleteNote(formData, noteid);
		setOpen(false);
	}

	async function handleSaveNote(formData: FormData) {
		await saveNote(formData, form);
		setOpen(false);
		toast.success('Item saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
	}
</script>

<Dialog.Root {open} onOpenChange={setOpen}>
	<Dialog.Content class="min-w-[600px] border-white/[2%] bg-[#0f0f0f]  p-12 sm:max-w-[425px]">
		<Dialog.Header class="mb-4 flex flex-row items-center gap-3 text-xl">
			<div>Add secure note</div>
			<form
				action="/private?/modifyData"
				method="POST"
				use:enhance={async ({ formData }) => await handleDeleteNote(formData)}
			>
				<button class="text-red-500/70 hover:text-red-500/100">
					<Trash size="24" />
				</button>
			</form>
		</Dialog.Header>
		<div class="flex flex-col gap-10">
			<form
				action="/private?/modifyData"
				method="POST"
				class="flex flex-col gap-6"
				use:enhance={({ formData }) => handleSaveNote(formData)}
			>
				<div class="relative flex flex-col">
					<label for="title" class="text-sm text-white/70">Title</label>
					<input
						placeholder="Title of your note"
						required
						class="h-[40px] border-b border-b-white/20 bg-transparent transition-all focus:border-[#4cc3a4]"
						bind:value={form.title}
						id="title"
						type="text"
					/>
				</div>

				<div class="relative flex flex-col gap-1">
					<label for="note" class="text-sm text-white/70">Note</label>
					<textarea
						bind:value={form.note}
						placeholder="Your note"
						required
						class="min-h-[300px] rounded-lg border border-white/[2%] bg-transparent p-4 !shadow-none !outline-none transition-all focus:!border-[#4cc3a4]"
						id="note"
					></textarea>
				</div>
				<div class="relative flex flex-col"></div>

				<div class="flex justify-end gap-3">
					<button
						onclick={() => setOpen(false)}
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

<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { deleteNote, saveNote } from '../store/store.svelte';
	import type { NoteType } from '../private.types';
	import { enhance } from '$app/forms';
	import { privateData } from '../store/store.svelte';
	import { Pencil, Trash } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { clone } from '$lib/utils/';

	const {
		open,
		setOpenViewNoteModal,
		noteid
	}: { open: boolean; setOpenViewNoteModal: (value: boolean) => void; noteid: string | null } =
		$props();

	let form = $state({
		noteid: null,
		title: '',
		note: ''
	}) as NoteType;

	let editActive = $state(false);
	let changesMade = $state(false);

	let titleRef: HTMLElement | undefined = $state();

	async function handleDeleteNote(formData: FormData) {
		if (!noteid) return;
		await deleteNote(formData, noteid);
		setOpenViewNoteModal(false);
	}

	function handleClose(e: MouseEvent) {
		e.preventDefault();
		setOpenViewNoteModal(false);
	}

	async function handleEditActive(e: MouseEvent) {
		e.preventDefault();
		editActive = !editActive;
		await tick();
		if (!titleRef) return;
		if (!editActive) {
			titleRef.blur();
		} else {
			titleRef.focus();
		}
	}

	$effect(() => {
		if (!open) {
			editActive = false;
		}
	});

	$effect(() => {
		if (noteid) {
			if (JSON.stringify(form) !== JSON.stringify(privateData.data.notes[noteid])) {
				changesMade = true;
			} else {
				changesMade = false;
			}
		}
	});

	$effect(() => {
		if (!noteid) return;
		if (open) {
			form = clone(privateData.data.notes[noteid]);
		}
	});

	async function handleSaveNote(formData: FormData) {
		await saveNote(formData, form);
		setOpenViewNoteModal(false);
	}
</script>

<Dialog.Root {open} onOpenChange={setOpenViewNoteModal}>
	<Dialog.Content class="min-w-[600px] border-white/[2%] bg-[#0f0f0f]  p-12 sm:max-w-[425px]">
		<div class="flex flex-col gap-10">
			<div class="absolute right-12 top-4 flex items-center gap-3">
				<button
					onclick={(e) => handleEditActive(e)}
					class={`${editActive ? 'text-white' : 'text-white/70'} flex items-center`}
				>
					<Pencil size="18" />
				</button>
				{#if editActive}
					<form
						action="/private?/modifyData"
						class="p-0"
						method="POST"
						use:enhance={({ formData }) => handleDeleteNote(formData)}
					>
						<button type="submit" class="flex items-center">
							<Trash size="18" class="text-red-500/80 hover:text-red-500" />
						</button>
					</form>
				{/if}
			</div>
			<form
				action="/private?/modifyData"
				method="POST"
				class="flex flex-col gap-6"
				use:enhance={({ formData }) => handleSaveNote(formData)}
			>
				<div class="flex w-full items-center justify-between">
					<div class="relative flex w-full flex-col gap-1">
						{#if editActive}
							<label class="text-sm text-white/80" for="title">Title</label>
						{/if}
						<input
							placeholder="Title of your note"
							required
							class={`h-[40px] w-full ${editActive ? 'border-b border-b-white/20 transition-all focus:border-[#4cc3a4]' : 'pointer-events-none'}  bg-transparent !text-xl  `}
							bind:value={form.title}
							bind:this={titleRef}
							id="title"
							type="text"
						/>
					</div>
				</div>

				<div class="relative flex flex-col gap-2">
					{#if editActive}
						<label class="text-sm text-white/80" for="title">Note</label>
					{/if}
					<textarea
						bind:value={form.note}
						placeholder="Your note"
						required
						class={`  ${editActive ? 'transition-border !border-white/10 p-3  focus:!border-b-[#4cc3a4]' : 'pointer-events-none !border-white/5'} max-h-[300px] min-h-[300px] rounded-lg border bg-transparent p-4 !shadow-none !outline-none transition-all`}
						id="note"
					></textarea>
				</div>
				<div class="flex justify-end gap-3">
					<button
						onclick={(e) => handleClose(e)}
						class="text-md rounded-lg p-3 px-4 font-medium hover:bg-white/[5%]">Cancel</button
					>
					<button
						type="submit"
						class="text-md rounded-lg p-3 px-4 font-medium"
						disabled={!changesMade}
						class:opacity-50={!changesMade}
						style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
						>Save note</button
					>
				</div>
			</form>
		</div>
	</Dialog.Content>
</Dialog.Root>

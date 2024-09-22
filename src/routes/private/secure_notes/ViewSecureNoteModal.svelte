<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { deleteNote, saveNote } from '../store/store.svelte';
	import type { NoteType } from '../private.types';
	import { enhance } from '$app/forms';
	import { privateData } from '../store/store.svelte';
	import { Edit, Trash, Copy, Check } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { clone, copyToClipboard } from '$lib/utils/';
	import dayjs from 'dayjs';

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
	let copied = $state(false);

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

	function handleCopyToClipboard(value: string) {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 3000);
		copyToClipboard(value);
	}

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
			<form
				action="/private?/modifyData"
				class="absolute bottom-16 left-12"
				method="POST"
				use:enhance={({ formData }) => handleDeleteNote(formData)}
			>
				<button type="submit" class="flex items-center">
					<Trash size="18" class="text-red-500/80 hover:text-red-500" />
				</button>
			</form>
			<div class="absolute right-12 top-4 flex items-center gap-3">
				<button
					onclick={(e) => handleEditActive(e)}
					class={`${editActive ? 'text-white' : 'text-white/70'} flex items-center hover:text-white`}
				>
					<Edit size="18" />
				</button>
			</div>
			<form
				action="/private?/modifyData"
				method="POST"
				class="flex flex-col gap-6"
				use:enhance={({ formData }) => handleSaveNote(formData)}
			>
				<div class="flex w-full items-center justify-between">
					<div class="relative flex w-full flex-col gap-1">
						<label class="text-sm text-white/80" for="title">Title</label>
						<input
							placeholder="Title of your note"
							required
							class={`${editActive ? 'border-b-white/10' : 'pointer-events-none border-b-white/5'} h-[40px] w-full border-b  bg-transparent !text-xl transition-all focus:border-[#4cc3a4]`}
							bind:value={form.title}
							bind:this={titleRef}
							id="title"
							type="text"
						/>
					</div>
				</div>

				<div class="relative flex flex-col gap-2">
					<label class="text-sm text-white/80" for="title">Note</label>
					<textarea
						bind:value={form.note}
						placeholder="Your note"
						required
						class={`  ${editActive ? 'transition-border !border-white/10 p-3  focus:!border-[#4cc3a4]' : 'pointer-events-none !border-white/5'} max-h-[300px] min-h-[300px] rounded-lg border bg-transparent p-4 !shadow-none !outline-none transition-all`}
						id="note"
					></textarea>
					{#if copied}
						<Check size="20" class="absolute right-2 top-9 cursor-pointer text-[#4cc3a4]" />
					{:else}
						<Copy
							size="20"
							class="absolute right-2 top-9 cursor-pointer text-white/80 hover:text-white"
							onclick={() => handleCopyToClipboard(form.note)}
						/>
					{/if}
					<div class="left-3 top-3 text-xs text-white/70">
						<div class="flex flex-col gap-1">
							<div class="text-xs font-normal tracking-wide text-white/50">Last Modified</div>
							<div class="text-xs font-normal tracking-wide text-white/80">
								{dayjs(form.updated_at).format('MMM DD, YYYY HH:mm')}
							</div>
						</div>
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

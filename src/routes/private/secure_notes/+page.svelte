<script lang="ts">
	import { Trash, Plus } from 'lucide-svelte';
	import AddSecureNoteModal from './AddSecureNoteModal.svelte';
	import ViewSecureNoteModal from './ViewSecureNoteModal.svelte';
	import NoteCard from './NoteCard.svelte';
	import dayjs from 'dayjs';
	import { privateData } from '../store/store.svelte';

	let openAddNoteModal = $state(false);
	let openViewNoteModal = $state(false);
	let noteid: string | null = $state('');

	function setOpenAddNoteModal(value: boolean) {
		openAddNoteModal = value;
	}

	function setOpenViewNoteModal(value: boolean) {
		openViewNoteModal = value;
	}

	async function handleViewNote(_noteid: string | null) {
		noteid = _noteid;
		setOpenViewNoteModal(true);
	}
</script>

<AddSecureNoteModal open={openAddNoteModal} {setOpenAddNoteModal} />
<ViewSecureNoteModal open={openViewNoteModal} {setOpenViewNoteModal} {noteid}></ViewSecureNoteModal>
<div class="flex h-full flex-col gap-6 overflow-auto p-[40px]">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="text-[34px] font-bold">Secure notes</div>
			<button
				onclick={() => setOpenAddNoteModal(true)}
				class="flex h-[48px] min-w-[48px] transform rounded-full transition-all hover:scale-110"
				style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
			>
				<Plus size="24" class="m-auto text-white" stroke="0.2" />
			</button>
		</div>
	</div>
	<div
		class="relative grid gap-4"
		style="grid-template-columns: repeat(auto-fill, minmax(148px, 1fr))"
	>
		{#each Object.values(privateData.data.notes) as note}
			<NoteCard {note} {handleViewNote} />
		{/each}
	</div>
</div>

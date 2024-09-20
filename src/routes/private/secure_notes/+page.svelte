<script lang="ts">
	import { Trash, Plus } from 'lucide-svelte';
	import AddSecureNoteModal from './AddSecureNoteModal.svelte';
	import dayjs from 'dayjs';
	import { privateData } from '../store/store.svelte';

	let open = $state(false);
	let noteid: string | null = $state('');

	function setOpen(value: boolean) {
		if (!value) noteid = '';
		open = value;
	}

	async function handleViewNote(_noteid: string | null) {
		noteid = _noteid;
		setOpen(true);
	}
</script>

<AddSecureNoteModal {open} {setOpen} {noteid} />
<div class="flex h-full flex-col gap-6 overflow-auto p-[40px]">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="text-[34px] font-bold">Secure notes</div>
			<button
				onclick={() => (open = true)}
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
		{#each Object.values(privateData.data.notes) as note, i}
			<button
				onclick={() => handleViewNote(note.noteid)}
				class="relative flex h-[200px] cursor-pointer flex-col gap-4 rounded-xl bg-[#0a0a0a] p-6 text-white/80 transition-all hover:bg-[#060606] hover:!text-white"
			>
				<div class="max-w-[100px] items-center justify-between truncate text-sm font-semibold">
					{note.title}
				</div>
				<div class="flex h-full w-full">
					<div class="gap-2.4 flex h-full flex-1 flex-col gap-2.5">
						<div class="h-[5px] w-[100%] rounded-full bg-[#4cc3a4]/50"></div>
						<div class="h-[5px] w-[100%] rounded-full bg-[#4cc3a4]/50"></div>
						<div class="h-[5px] w-[60%] rounded-full bg-[#4cc3a4]/50"></div>
						<div class="bg-tranparent h-[5px] w-[100%] rounded-full"></div>
						<div class="h-[5px] w-[100%] rounded-full bg-[#4cc3a4]/50"></div>
						<div class="h-[5px] w-[70%] rounded-full bg-[#4cc3a4]/50"></div>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>

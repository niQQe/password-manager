<script lang="ts">
	import type { NoteType } from '../private.types';
	import dayjs from 'dayjs';	
	const {
		handleViewNote,
		note
	}: {
		handleViewNote: (noteid: string | null) => void;
		note: NoteType;
	} = $props();
</script>

<button
	onclick={() => handleViewNote(note.noteid)}
	class="relative flex h-[200px] cursor-pointer flex-col gap-4 rounded-xl bg-[#0a0a0a] p-6 text-white/80 transition-all hover:bg-[#060606] hover:!text-white"
>
	<div class="h-[25px] max-w-[100px] items-center justify-between truncate text-sm font-semibold">
		{note.title}
	</div>
	<div class="flex h-full w-full flex-col">
		<div class="gap-2.4 flex h-full w-full flex-1 flex-col gap-2.5">
			<div class="h-[5px] w-[100%] rounded-full bg-[#4cc3a4]/50"></div>
			<div class="h-[5px] w-[100%] rounded-full bg-[#4cc3a4]/50"></div>
			<div class="h-[5px] w-[60%] rounded-full bg-[#4cc3a4]/50"></div>
			<div class="bg-tranparent h-[5px] w-[100%] rounded-full"></div>
			<div class="h-[5px] w-[100%] rounded-full bg-[#4cc3a4]/50"></div>
			<div class="h-[5px] w-[70%] rounded-full bg-[#4cc3a4]/50"></div>
		</div>
		<div class="text-[11px] text-white/20 mb-[-5px]">
			{dayjs(note.created_at).format('D MMM, YYYY HH:mm')}	
		</div>
	</div>
</button>

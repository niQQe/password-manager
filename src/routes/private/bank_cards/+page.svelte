<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import { privateData } from '../store/store.svelte';
	import BankCard from './BankCard.svelte';
	import AddBankCardModal from './AddBankCardModal.svelte';

	let openAddBankCardModal = $state(false);

	function setOpenAddNoteModal(value: boolean) {
		openAddBankCardModal = value;
	}
</script>

<AddBankCardModal open={openAddBankCardModal} {setOpenAddNoteModal} />
<div class="flex h-full flex-col gap-6 overflow-auto p-[40px]">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-between">
			<div class="text-[34px] font-bold">Bank cards</div>
			<button
				onclick={() => setOpenAddNoteModal(true)}
				class="flex h-[48px] min-w-[48px] transform rounded-full transition-all hover:scale-110"
				style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%)"
			>
				<Plus size="24" class="m-auto text-white" stroke="0.2" />
			</button>
		</div>
	</div>
	{#if Object.values(privateData.data.bankcards).length !== 0}
		<div class="flex h-full w-full">
			<div class="m-auto flex flex-col gap-2">
				<div class="border-b border-white/10 pb-3 text-center text-2xl font-bold">
					No cards added yet!
				</div>
				<div class="text-center text-white/70">Use the plus [+] button at the top to add some!</div>
			</div>
		</div>
	{:else}
		<div class="relative flex items-start gap-4">
			<BankCard />
			<BankCard />
			<BankCard />
		</div>
	{/if}
</div>

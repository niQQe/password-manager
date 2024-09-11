<script lang="ts">
	import { CreditCard, FileKey, Settings, User, SquareAsterisk, Shield } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	const { email } = $props() as any;
</script>

<div class="flex min-h-[800px] w-[435px] flex-col gap-8 bg-[#191919] p-7">
	<div class="flex justify-center pt-4">
		<div class="flex h-[40px] items-center gap-3 text-2xl font-semibold text-white">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full"
				style="background:linear-gradient(34deg, rgb(66 142 219) 0%, rgb(80 212 146) 100%);box-shadow:0px 0px 14px 0px #ffffff4d"
			>
				<SquareAsterisk size="20" class="text-white" />
			</div>
			CipherNest
		</div>
	</div>
	<div class="px-3">
		<div class="flex items-center gap-3 border-b border-white/15 pb-6">
			<div class="flex h-8 w-8 rounded-full ring-2 ring-[#4cc3a4]">
				<User size="20" class="m-auto" />
			</div>
			<div class="font-bold">
				{email}
			</div>
		</div>
	</div>
	<div class="flex flex-col">
		<div class="px-3 text-xs font-normal uppercase text-white/60">Vault</div>
		<ul class="flex w-full flex-col gap-1 py-3 text-sm tracking-wide">
			<li
				class="flex w-full items-center gap-3 rounded-xl bg-[#292929] p-3 text-white hover:bg-[#29292992]"
			>
				<Shield fill="#4cc3a4" class="text-[#4cc3a4]" size="20" />
				<div>Passwords</div>
			</li>
			<li class="flex items-center gap-3 rounded-xl p-3 text-white/70 hover:bg-[#29292943]">
				<FileKey size="20" />
				<div>Secure notes</div>
			</li>
			<li class="flex items-center gap-3 rounded-xl p-3 text-white/70 hover:bg-[#29292943]">
				<CreditCard size="20" />
				<div>Bank cards</div>
			</li>
			<li class="flex items-center gap-3 rounded-xl p-3 text-white/70 hover:bg-[#29292943]">
				<Settings size="20" />
				<div>Settings</div>
			</li>
		</ul>
	</div>
</div>

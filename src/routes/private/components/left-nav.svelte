<script lang="ts">
	import { RectangleEllipsis, FileKey, Settings, Search, SquareAsterisk } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
</script>

<div class="fixed left-0 top-0 flex h-full w-[280px] flex-col items-start gap-3 p-6">
	<div class="flex flex-col gap-3">
		<div class="flex h-[40px] items-center gap-3 text-lg font-semibold text-gray-700">
			<div class="flex h-8 w-8 items-center justify-center rounded-md " style="background: linear-gradient(270deg, hsla(221, 91%, 39%, 1) 0%, hsla(221, 83%, 53%, 1) 100%);">
				<SquareAsterisk size="20" class="text-white" />
			</div>
			CipherNest
		</div>
		<div class="relative">
			<Search size="18" class="absolute left-3 top-1/2 -translate-y-1/2 transform" />
			<Input placeholder="Search" class="!pl-[40px] " />
		</div>
	</div>
	<ul class="flex w-full flex-col py-3 text-sm tracking-wide">
		<li
			class="flex w-full items-center gap-3 rounded-md bg-blue-50 p-3 text-blue-600 hover:bg-gray-200"
		>
			<RectangleEllipsis size="20" />
			<div>Passwords</div>
		</li>
		<li class="flex items-center gap-3 rounded-md p-3 text-gray-600 hover:bg-gray-200">
			<FileKey size="20" />
			<div>Secure notes</div>
		</li>
		<li class="flex items-center gap-3 rounded-md p-3 text-gray-600 hover:bg-gray-200">
			<Settings size="20" />
			<div>Settings</div>
		</li>
	</ul>
</div>

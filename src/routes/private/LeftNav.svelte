<script lang="ts">
	import {
		CreditCard,
		FileKey,
		Settings,
		ChevronDown,
		Activity,
		User,
		SquareAsterisk,
		Shield,
		LogOut
	} from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { goto } from '$app/navigation';
	import type { MenuItemType } from './private.types';

	import { page } from '$app/stores';
	const { email, supabase } = $props() as any;

	const menuItems: MenuItemType[] = $state([
		{
			icon: Shield,
			text: 'Passwords',
			route: '/private/passwords'
		},
		{
			icon: Activity,
			text: 'Password health',
			route: '/private/password_health'
		},
		{
			icon: FileKey,
			text: 'Secure notes',
			route: '/private/secure_notes'
		},
		{
			icon: CreditCard,
			text: 'Bank cards',
			route: ''
		},
		{
			icon: Settings,
			text: 'Settings',
			route: '/private/settings'
		}
	]);

	async function handleLogout() {
		await supabase.auth.signOut();
	}
</script>

<div class="z-[20] flex min-h-[800px] w-[435px] flex-col gap-8 bg-[#191919] p-7">
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
	<div class="w-full">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="h-[60px] w-full rounded-xl  border-none bg-transparent px-3 transition-all hover:bg-[#29292992]"
			>
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 rounded-full ring-2 ring-[#4cc3a4]">
						<User size="20" class="m-auto" />
					</div>
					<div class="font-bold">
						{email}
					</div>
					<ChevronDown class="ml-auto" size="16" />
				</div>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="border-none bg-[#121212]" sameWidth>
				<DropdownMenu.Group>
					<DropdownMenu.Item
						class="flex gap-3 py-2 text-sm"
						onclick={() => goto('/private/settings')}
						><Settings size="20" /> Settings</DropdownMenu.Item
					>
					<DropdownMenu.Item class="flex gap-3 text-sm" onclick={() => handleLogout()}
						><LogOut size="20" /> Log out</DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="flex flex-col">
		<div class="px-3 text-xs font-normal uppercase text-white/60">Vault</div>
		<div class="flex w-full flex-col gap-1 py-3 text-sm tracking-wide">
			{#each menuItems as item}
				<button
					onclick={() => goto(item.route)}
					class:bg-[#292929]={item.route === $page.url.pathname}
					class="flex w-full items-center gap-3 rounded-xl bg-[#292929] p-3 text-white hover:bg-[#29292992]"
				>
					<svelte:component
						this={item.icon}
						size="20"
						class={item.route === $page.url.pathname ? 'text-[#4cc3a4]' : 'text-white'}
					/>
					<div>{item.text}</div>
				</button>
			{/each}
		</div>
	</div>
</div>

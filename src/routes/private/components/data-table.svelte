<script lang="ts">
	import type { ItemType } from '../private.types';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Pencil, Copy, ExternalLink, Ellipsis, Info, Trash } from 'lucide-svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { privateStates, saveItem, deleteItem } from '../store/store.svelte';
	import { enhance } from '$app/forms';
	import { clone } from '$lib/utils/deepCopy';
	import { toast } from 'svelte-sonner';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import dayjs from 'dayjs';
	import { checkPasswordStrength } from '$lib/utils/passwordStrength';

	dayjs.extend(relativeTime);
	let open = $state(false);

	function setOpen(value: boolean) {
		open = value;
	}

	let details: ItemType = $state({
		created_at: '2021-09-01T00:00:00.000Z',
		updated_at: '2021-09-01T00:00:00.000Z',
		itemid: '123',
		url: 'www.pornhub.com',
		username: 'roccosifredi78',
		password: '12345678'
	});

	function handleShowDetails(itemid: string) {
		details = clone(privateStates.items[itemid]);
		setOpen(true);
	}

	async function handleDelete(formData: FormData) {
		await deleteItem(formData, details.itemid);
		toast.success('Item deleted', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
		setOpen(false);
	}

	async function handleSaveChanges(formData: FormData) {
		await saveItem(formData, details);
		toast.success('Item changes saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
		setOpen(false);
	}
</script>

<div class="w-full rounded-2xl">
	<div class="flex w-full flex-col rounded-2xl border border-gray-100 shadow-md">
		{#if Object.keys(privateStates.items).length === 0}
			<div class="flex h-64 items-center justify-center text-gray-500">No passwords found</div>
		{:else}
			<table class="">
				<thead>
					<tr class="h-12">
						<th class="px-6 text-left text-sm font-[400] tracking-wide text-gray-500">
							Company name
						</th>
						<th class="px-6 text-left text-sm font-[400] tracking-wide text-gray-500"> Added </th>
						<th class="px-6 text-left text-sm font-[400] tracking-wide text-gray-500">
							Last updated
						</th>
						<th class="px-6 text-left text-sm font-[400] tracking-wide text-gray-500">
							Password strength
						</th>
						<th class="px-6 text-left text-sm font-[400] tracking-wide text-gray-500"> </th>
					</tr>
				</thead>
				<tbody>
					{#each Object.values(privateStates.items) as item}
						<tr>
							<td class="flex-1 p-6 py-4 text-sm text-gray-700">
								<div class="flex items-center gap-3">
									<div class="h-12 w-12 rounded bg-gray-100"></div>
									<div class="flex flex-col">
										<div>{item.url}</div>
										<div>{item.username}</div>
									</div>
								</div>
							</td>
							<td class="flex-1 p-6 py-6 text-sm text-gray-700"
								>{dayjs(item.created_at).format('MMM DD, YYYY hh:mm A')}</td
							>
							<td class="flex-1 p-6 py-6 text-sm text-gray-700"
								>{dayjs(item.updated_at).fromNow()}</td
							>
							<td class="flex-1 p-6 py-6 text-sm">
								{#if checkPasswordStrength(item.password) <= 2}
									<div
										class="items flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-red-800"
									>
										Weak
										<div class="relative h-[3px] w-full rounded bg-gray-100">
											<div
												class="absolutetop-0 left-0 h-full w-full max-w-[20%] rounded bg-red-500"
											></div>
										</div>
									</div>
								{:else if checkPasswordStrength(item.password) === 3}
									<div
										class="items flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-yellow-800"
									>
										Decent
										<div class="relative h-[3px] w-full rounded bg-gray-100">
											<div
												class="absolutetop-0 left-0 h-full w-full max-w-[40%] rounded bg-yellow-500"
											></div>
										</div>
									</div>
								{:else if checkPasswordStrength(item.password) === 4}
									<div
										class="items flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-lime-800"
									>
										Strong
										<div class="relative h-[3px] w-full rounded bg-gray-100">
											<div
												class="absolutetop-0 left-0 h-full w-full max-w-[80%] rounded bg-lime-500"
											></div>
										</div>
									</div>
								{:else if checkPasswordStrength(item.password) >= 5}
									<div
										class="items flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-green-800"
									>
										Very strong
										<div class="relative h-[3px] w-full rounded bg-gray-100">
											<div
												class="absolutetop-0 left-0 h-full w-full max-w-[100%] rounded bg-green-500"
											></div>
										</div>
									</div>
								{/if}
							</td>
							<td class="flex flex-1 justify-end p-6 py-6 text-sm text-gray-700">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button class="h-10 w-10 p-2" builders={[builder]} variant="outline">
											<Ellipsis size="16" />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="w-56">
										<DropdownMenu.Item onclick={() => handleShowDetails(item.itemid)}>
											<Pencil size="18" class="mr-2 h-4 w-4 text-gray-500" />
											<span class="text-sm text-gray-800"> See details</span>
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<ExternalLink size="18" class="mr-2 h-4 w-4 text-gray-500" />
											<span class="text-sm text-gray-800">Go to website</span>
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<Copy size="18" class="mr-2 h-4 w-4 text-gray-500" />
											<span class="text-sm text-gray-800">Copy username</span>
										</DropdownMenu.Item>
										<DropdownMenu.Item>
											<Copy size="18" class="mr-2 h-4 w-4 text-gray-500" />
											<span class="text-sm text-gray-800">Copy password</span>
										</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
	<Sheet.Root {open} onOpenChange={setOpen}>
		<Sheet.Content class="min-w-[520px] " side="right">
			<Sheet.Header>
				<div class="flex items-center gap-6">
					<div class="h-20 w-20 rounded-md bg-gray-200"></div>
					<div>
						<div class="font-semibold">Company</div>
						<div class="text-gray-600">{details.url || 'www.pornhub.com'}</div>
					</div>
				</div>
			</Sheet.Header>
			<div class="flex h-[calc(100%-120px)] flex-col gap-4 py-4">
				<div class="flex items-center rounded-md bg-blue-50 p-2 text-xs">
					<div class="w-8">
						<Info size="18" class="text-blue-600" />
					</div>
					This account uses a resued password. Update it now for better protection
				</div>
				<div class="flex w-full flex-col gap-6 rounded-lg border p-6">
					<div class="font-medium">Login details</div>
					<form class="flex flex-col gap-3">
						<div>
							<Label>Username</Label>
							<Input type="text" bind:value={details.username} />
						</div>
						<div>
							<Label>Passsword</Label>
							<Input autocomplete="false" type="password" bind:value={details.password} />
						</div>
						<div>
							<Label>Website</Label>
							<Input bind:value={details.url} />
						</div>
						<div>
							<Label>Notes</Label>
							<Textarea class="min-h-[200px]" />
						</div>
					</form>
				</div>
			</div>
			<Sheet.Footer>
				<form
					action="/private?/addPassword"
					class="mr-auto flex flex-col gap-3"
					method="POST"
					use:enhance={({ formData }: { formData: FormData }) => handleDelete(formData)}
				>
					<Button type="submit" variant="outline" class="h-10 w-10 p-0">
						<Trash class="text-red-500" size="18" />
					</Button>
				</form>
				<Sheet.Close asChild let:builder>
					<Button builders={[builder]} variant="ghost" type="submit">Close</Button>
				</Sheet.Close>
				<form
					action="/private?/addPassword"
					class="flex flex-col gap-3"
					method="POST"
					use:enhance={({ formData }: { formData: FormData }) => handleSaveChanges(formData)}
				>
					<Button type="submit">Save changes</Button>
				</form>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</div>

<style>
	table {
		width: 100%;
		border-collapse: collapse; /* Collapse borders */
	}
	th {
		border-bottom: 1px solid #efefef;
	}
	td {
		border-bottom: 1px solid #efefef;
	}
</style>

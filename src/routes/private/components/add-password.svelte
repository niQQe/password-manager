<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ItemType } from '../private.types';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { saveItem } from '../store/store.svelte';
	import { enhance } from '$app/forms';
	import { Plus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import axios from 'axios';
	import dayjs from 'dayjs';
	let open = $state(false);

	let form = $state({
		itemid: '',
		url: '',
		username: '',
		password: ''
	}) as ItemType;

	async function handleSavePassword(formData: FormData) {
		await saveItem(formData, form);
		setOpen(false);
		toast.success('Item saved', {
			description: dayjs().format('D MMM, YYYY HH:mm')
		});
	}

	function setOpen(value: boolean) {
		open = value;
		for (let key in form) {
			// @ts-ignore
			form[key] = '';
		}
	}
</script>

<Dialog.Root {open} onOpenChange={setOpen}>
	<Dialog.Trigger class={buttonVariants({ variant: 'default', class: '!pl-2' })}>
		<div class="flex gap-2">
			<Plus size="20" />Add new
		</div>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Add password</Dialog.Title>
			<Dialog.Description>Add a password with the form below.</Dialog.Description>
		</Dialog.Header>
		<form class="flex flex-col gap-3">
			<div>
				<Label for="name" class="text-right">URL</Label>
				<Input id="name" placeholder="Enter url" bind:value={form.url} />
			</div>
			<div>
				<Label for="username" class="text-right">Username</Label>
				<Input id="username" placeholder="Enter username" bind:value={form.username} />
			</div>
			<div>
				<Label for="password" class="text-right">Password</Label>
				<Input
					id="password"
					autocomplete="false"
					placeholder="Enter password"
					bind:value={form.password}
					type="password"
				/>
			</div>
		</form>
		<Dialog.Footer>
			<form
				action="/private?/addItem"
				class="flex flex-col gap-3"
				method="POST"
				use:enhance={({ formData }: { formData: FormData }) => handleSavePassword(formData)}
			>
				<Button type="submit">Save</Button>
			</form>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<script>
	import '../app.css';
	import { goto, invalidate } from '$app/navigation';

	import { onMount } from 'svelte';

	onMount(async () => {
		if (!window.argon2) await import('argon2-browser');
	});

	const { data: propsData, children } = $props();
</script>

<div class="min-h-full w-full" id="page">
	{@render children()}
</div>

<style>
</style>

<script>
	import '../app.css';
	import { onMount } from 'svelte';
	onMount(async () => {
		if (!window.argon2) await import('argon2-browser');
	});
	const { children } = $props();
</script>

<div class="min-h-full w-full" id="page">
	{@render children()}
</div>

<style></style>

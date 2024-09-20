<script>
	import '../app.css';
	import { onMount } from 'svelte';
	const { children } = $props();
</script>

<div class="min-h-full w-full" id="page">
	{@render children()}
</div>

<style></style>

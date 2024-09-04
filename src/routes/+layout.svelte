<script>
	import '../app.css';
	import '@fontsource/geist-sans';
	import '@fontsource/geist-sans/700.css';
	import '@fontsource/geist-sans/600.css';
	import '@fontsource/geist-sans/500.css';
	import '@fontsource/geist-sans/400.css';

	import { goto, invalidate } from '$app/navigation';

	const { data: propsData, children } = $props();
</script>

<div class="min-h-full w-full" id="page">
	{@render children()}
</div>

<style>
	:global(body) {
		font-family: 'Geist Sans', sans-serif;
	}
</style>

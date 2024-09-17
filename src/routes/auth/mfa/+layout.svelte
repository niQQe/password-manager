<script lang="ts">
	import { onMount } from 'svelte';
	const { data: propsData, children } = $props();
</script>

<div class="flex h-[100vh] w-full items-center justify-center">
	{@render children()}
</div>

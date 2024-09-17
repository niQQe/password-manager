<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	const { data: propsData, children } = $props();
	import Loader from '$lib/components/ui/loader/loader.svelte';
</script>
<!-- 
{#if loading}
	<div class="flex h-[100vh] w-full items-center justify-center text-white">
		<Loader />
	</div>
{:else}
{/if} -->
{@render children()}

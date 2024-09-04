<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import PublicContent from './public/+page.svelte';
	import PrivateContent from './private/+page.svelte';
	import { browser } from '$app/environment';
	import { tick } from 'svelte';
	const { data } = $props();
</script>

<PublicContent />

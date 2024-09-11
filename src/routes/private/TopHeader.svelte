<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import CreateItem from './CreateItem.svelte';
</script>

<div class="bg-red flex items-center">
	<div class="flex gap-3">
		<Button type="submit" variant="outline">Import</Button>
		<Button type="submit" variant="outline">Share</Button>
	</div>
	<div class="ml-auto">
		<CreateItem />
	</div>
</div>

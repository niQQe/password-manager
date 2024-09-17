<script>
	const { data: propsData, children } = $props();
	import { invalidate } from '$app/navigation';
	const { supabase, session } = propsData;
	import { goto } from '$app/navigation';
</script>

{@render children()}

<style></style>

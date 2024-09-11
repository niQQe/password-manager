<script lang="ts">
	const { children } = $props() as any;
</script>

<div class="text-white">
	{@render children()}
</div>

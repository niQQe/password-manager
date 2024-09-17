<script lang="ts">
</script>

<div class="loader"></div>

<style>
	.loader {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: inline-block;
		position: relative;
		border: 7px solid;
		border-color: rgba(76, 195, 164, 0.15) rgba(76, 195, 164, 0.25) rgba(76, 195, 164, 0.35)
			rgba(76, 195, 164, 0.5);
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>

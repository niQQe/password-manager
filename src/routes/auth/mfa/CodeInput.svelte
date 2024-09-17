<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';

	const {
		verifyOTP,
		invalidCode
	}: {
		verifyOTP: (code: string) => Promise<void>;
		invalidCode: boolean;
	} = $props();

	let digits = $state({
		d1: null,
		d2: null,
		d3: null,
		d4: null,
		d5: null,
		d6: null
	}) as any;

	const digitRefs = {
		d1: null,
		d2: null,
		d3: null,
		d4: null,
		d5: null,
		d6: null
	} as any;

	let verifyCode = $state('');

	function handleBackspace(e: KeyboardEvent) {
		if (e.key === 'Backspace') {
			// if (Object.values(digits).every((digit: number | null) => digit === null)) {
			// 	e.preventDefault();
			// 	return;
			// }
			for (let i = 6; i >= 1; i--) {
				if (digits[`d${i}`] !== null) {
					digits[`d${i}`] = null;
					digitRefs[`d${i}`].focus();
					break;
				}
			}
		}
	}

	$effect(() => {
		(async () => {
			// Every digit has a value
			if (Object.values(digits).every((digit) => digit !== null)) {
				await tick();
				digitRefs.d6.blur();
				verifyCode = Object.values(digits).join('');
				verifyOTP(verifyCode);
			}
		})();
	});

	$effect(() => {
		for (let i = 1; i <= 6; i++) {
			if (digits[`d${i}`] !== null) {
				digitRefs[`d${i + 1}`]?.focus();
			}
		}
	});

	$effect(() => {
		if (invalidCode) {
			handleInvalidCode();
		}
	});

	function allowOnlyDigits(event: KeyboardEvent) {
		const key = event.key;

		// Allow digits (0-9), backspace, and arrow keys
		if (!/[0-9]/.test(key) && key !== 'Backspace' && key !== 'ArrowLeft' && key !== 'ArrowRight') {
			event.preventDefault(); // Prevent the keypress if it's not a digit
		}
	}

	async function handleInvalidCode() {
		digits = {
			d1: null,
			d2: null,
			d3: null,
			d4: null,
			d5: null,
			d6: null
		};
		await tick();
		digitRefs.d1.focus();
	}

	onMount(async () => {
		window.addEventListener('keydown', handleBackspace);
		await tick();
		digitRefs.d1.focus();
	});
</script>

<div class="relative flex h-[60px] justify-center gap-3">
	<div class="flex max-w-[350px] gap-3">
		{#each Object.keys(digits) as key, index}
			<input
				type="text"
				bind:this={digitRefs[key]}
				bind:value={digits[key]}
				disabled={(digits[`d${index}`] === null && index !== 0) || digits[`d${index + 1}`] !== null}
				class:opacity-50={digits[`d${index}`] === null && index !== 0}
				maxlength="1"
				onkeydown={(event) => allowOnlyDigits(event)}
				class="w-full max-w-[calc(100%/6)px] rounded-md border border-white/20 bg-transparent text-center text-3xl text-white focus:!border-[#4cc3a4]"
			/>
			{#if key === 'd3'}
				<div class="mx-2"></div>
			{/if}
		{/each}
	</div>
</div>

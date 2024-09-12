<script lang="ts">
	import type { IResult } from 'password-meter';
	import { PasswordMeter } from 'password-meter';

	type strengthDictType = {
		veryWeak: { status: string; class: string };
		weak: { status: string; class: string };
		medium: { status: string; class: string };
		strong: { status: string; class: string };
		veryStrong: { status: string; class: string };
		perfect: { status: string; class: string };
	};

	type StrengthKey = keyof strengthDictType;

	let strengthDict: strengthDictType = {
		veryWeak: {
			status: 'Very weak',
			class: 'text-red-500'
		},
		weak: {
			status: 'Weak',
			class: 'text-orange-500'
		},
		medium: {
			status: 'Decent',
			class: 'text-yellow-500'
		},
		strong: {
			status: 'Strong',
			class: 'text-lime-500'
		},
		veryStrong: {
			status: 'Very strong',
			class: 'text-green-500'
		},
		perfect: {
			status: 'Ultimate!',
			class: 'text-amber-500 glow'
		}
	};

	const { password, class: _class }: { password: string; class?: string } = $props();

	const passwordStatus: () => IResult = $derived(() => new PasswordMeter().getResult(password));
</script>

<div class={`flex items-center gap-[40px] ${_class}`}>
	<div class="relative flex h-[160px] w-[160px]">
		<div class="m-auto text-[32px] font-medium">{passwordStatus().percent}%</div>
		<div
			class="absolute left-[3px] top-[3px] h-[154px] w-[154px] rounded-full border-[14px] border-green-600/[5%]"
		></div>
		<svg
			width="160"
			height="160"
			viewBox="0 0 160 160"
			style="transform: rotate(-90deg)"
			class="absolute left-0 top-0"
		>
			<circle
				r="70"
				cx="80"
				cy="80"
				fill="transparent"
				stroke="url(#gradient)"
				class="transition-all duration-1000"
				stroke-linecap="round"
				stroke-width="14px"
				stroke-dasharray="439.6px"
				stroke-dashoffset={439.6 * (1 - passwordStatus().percent / 100)}
			></circle>
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stop-color="#05a" />
					<stop offset="100%" stop-color="#0a5" />
				</linearGradient>
			</defs>
		</svg>
	</div>
	<div class="flex flex-col gap-1 tracking-wide">
		<div class="text-[20px]">
			Password score: {passwordStatus().score}<span></span>
		</div>
		<div class="text-widest text-sm">
			Password strength:
			{#if password.length}
				<span class={`${strengthDict[passwordStatus().status as StrengthKey].class} `}>
					{strengthDict[passwordStatus().status as StrengthKey].status}
				</span>
			{:else}
				<span class="text-sm text-white/50"> Nothing to evaluate </span>
			{/if}
		</div>
		<div class="text-wider text-sm font-semibold text-blue-400">Get new suggestion?</div>
	</div>
</div>

<style>
	.glow {
		text-align: center;
		-webkit-animation: glow 1s ease-in-out infinite alternate;
		-moz-animation: glow 1s ease-in-out infinite alternate;
		animation: glow 1s ease-in-out infinite alternate;
		text-shadow: 0 0 8px #ebcf02;
	}
</style>

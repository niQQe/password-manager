<script lang="ts">
	import { RefreshCcw, Info } from 'lucide-svelte';
	import { PasswordMeter } from 'password-meter';

	import { privateData } from '../store/store.svelte';

	const {
		reusedPasswordCount
	}: {
		reusedPasswordCount: () => Record<string, number>;
	} = $props();

	const totalReusedPasswordCount = $derived(() => {
		return Object.values(privateData.data.passwords).filter(
			(password) => reusedPasswordCount()[password.password] > 1
		).length;
	});

	const totalWeakPasswordsCount = $derived(() => {
		return Object.values(privateData.data.passwords).filter(
			(password) => new PasswordMeter().getResult(password.password).percent < 50
		).length;
	});

	const averagePasswordStrength = $derived(() => {
		const total = Object.values(privateData.data.passwords).reduce((acc, curr) => {
			return acc + new PasswordMeter().getResult(curr.password).percent;
		}, 0);
		return Math.round(total / Object.values(privateData.data.passwords).length);
	});
</script>

<div class="flex w-full flex-col gap-10">
	<div class="flex flex-col gap-6 text-sm text-white/70">
		<div class="flex gap-3 text-xs">
			<div>Last checked:</div>
			<span class="text-white">Just now</span>
			<div class="text-[#4cc3a4]">
				<RefreshCcw size="16" class="cursor-pointer" />
			</div>
		</div>
	</div>
	<div class="flex flex-col gap-4 rounded-xl">
		<div class="flex items-center gap-6">
			<div class="mr-6 flex flex-col gap-1">
				<div class="flex flex-col gap-6">
					<div class="text-sm text-white/60">Average password strength</div>
					<div class="flex w-full justify-center">
						<div class="relative flex h-[130px] w-[130px]">
							<div class="m-auto text-[26px] font-medium">{averagePasswordStrength()}%</div>
							<div
								class="absolute left-[3px] top-[3px] h-[124px] w-[124px] rounded-full border-[14px] border-green-600/[5%]"
							></div>
							<svg
								width="130"
								height="130"
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
									stroke-dashoffset={439.6 * (1 - averagePasswordStrength() / 100)}
								></circle>
								<defs>
									<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
										<stop offset="0%" stop-color="#05a" />
										<stop offset="100%" stop-color="#0a5" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>
				</div>
			</div>
			<div class="mt-8 flex gap-12">
				<div class="flex gap-6">
					<div class="flex items-center gap-4">
						<div><Info class="text-red-600" size="20"></Info></div>
						<div class="text-md flex flex-col">
							<div class="font-semibold">201 Compromised passwords</div>
							<div class="text-sm text-white/80">You should change these now.</div>
						</div>
					</div>
				</div>
				<div class="flex gap-6">
					<div class="flex items-center gap-4">
						<div><Info class="text-orange-600" size="20"></Info></div>
						<div class="text-md flex flex-col">
							<div class="font-semibold">{totalReusedPasswordCount()} reused passwords</div>
							<div class="text-sm text-white/80">Create unique passwords.</div>
						</div>
					</div>
				</div>
				<div class="flex gap-6">
					<div class="flex items-center gap-4">
						<div><Info class="text-yellow-600" size="20"></Info></div>
						<div class="text-md flex flex-col">
							<div class="font-semibold">{totalWeakPasswordsCount()} weak passwords</div>
							<div class="text-sm text-white/80">Weak password are easy to break.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { FlipHorizontal, Eye, EyeOff } from 'lucide-svelte';
</script>

<div class="flex flex-col gap-1 rounded-xl p-2">
	<div class="flex items-center justify-between">
		<div>Work</div>
		<div class="gap flex gap-2">
			<button class="text-white/70 hover:text-white"><FlipHorizontal size="16" /></button>
			<div class="text-white/70 hover:text-white"><EyeOff size="16" /></div>
		</div>
	</div>
	<div class="card scale-[1]">
		<div class="card-inner">
			<div class="card-front">
				<div class="card-bg"></div>
				<div class="card-glow"></div>
				<svg
					width="42"
					height="20"
					viewBox="0 0 72 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="logo"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M52.3973 1.01093L51.5588 5.99054C49.0448 4.56717 43.3231 4.23041 43.3231 6.85138C43.3231 7.89285 44.6177 8.60913 46.178 9.47241C48.5444 10.7817 51.5221 12.4291 51.5221 16.062C51.5221 21.8665 45.4731 24 41.4645 24C37.4558 24 34.8325 22.6901 34.8325 22.6901L35.7065 17.4848C38.1115 19.4688 45.4001 20.032 45.4001 16.8863C45.4001 15.5645 43.9656 14.785 42.3019 13.8811C40.0061 12.6336 37.2742 11.1491 37.2742 7.67563C37.2742 1.30988 44.1978 0 47.1132 0C49.8102 0 52.3973 1.01093 52.3973 1.01093ZM66.6055 23.6006H72L67.2966 0.414276H62.5732C60.3923 0.414276 59.8612 2.14215 59.8612 2.14215L51.0996 23.6006H57.2234L58.4481 20.1566H65.9167L66.6055 23.6006ZM60.1406 15.399L63.2275 6.72235L64.9642 15.399H60.1406ZM14.7942 16.3622L20.3951 0.414917H26.7181L17.371 23.6012H11.2498L6.14551 3.45825C2.83215 1.41281 0 0.807495 0 0.807495L0.108643 0.414917H9.36816C11.9161 0.414917 12.1552 2.50314 12.1552 2.50314L14.1313 12.9281L14.132 12.9294L14.7942 16.3622ZM25.3376 23.6006H31.2126L34.8851 0.414917H29.0095L25.3376 23.6006Z"
						fill="white"
					/>
				</svg>

				<div class="card-chip"></div>
				<div class="card-holder">John Doe</div>
				<div class="card-number">1234 5678 9000 1234</div>
				<div class="card-valid">12/24</div>
			</div>
			<div class="card-back">
				<div class="card-signature">John Doe</div>
				<div class="card-seccode">123</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.card {
		width: 240px;
		height: 150px;
		border-radius: 10px;
		perspective: 1000px;

		&:hover .card-inner {
			transform: rotateY(180deg);
		}

		&-inner {
			position: relative;
			width: 100%;
			height: 100%;
			border-radius: 10px;
			transition: transform 600ms ease;
			transform-style: preserve-3d;
			box-shadow: 0 0 25px 2px rgba(black, 0.2);
		}

		&-front,
		&-back {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			border-radius: 10px;
			overflow: hidden;
			backface-visibility: hidden;
			background: linear-gradient(321.03deg, #4cc3a4 0%, #2e8970 91.45%);
		}

		&-front {
			border-radius: 10px;
			overflow: hidden;
			position: relative;
			transition: transform 300ms ease-in-out;
		}

		&-back {
			transform: rotateY(180deg);

			&::before {
				content: '';
				position: absolute;
				top: 40%;
				left: 20%;
				width: 180%;
				height: 120%;
				border-radius: 100%;
				background-image: linear-gradient(
					to right top,
					#4cc3a4,
					#4cba9c,
					#4daf94,
					#50a28a,
					#4f9580,
					#4f8c7a,
					#4e8574,
					#508574,
					#568a7a,
					#548173,
					#568173,
					#547a6d
				);
				filter: blur(10px);
				opacity: 0.15;
			}

			&::after {
				content: '';
				position: absolute;
				top: 15%;
				width: 100%;
				height: 30px;
				background-image: linear-gradient(
					to right top,
					#4cc3a4,
					#4cba9c,
					#4daf94,
					#50a28a,
					#4f9580,
					#4f8c7a,
					#4e8574,
					#508574,
					#568a7a,
					#548173,
					#568173,
					#547a6d
				);
			}
		}

		&-bg {
			position: absolute;
			top: -20px;
			right: -120px;
			width: 380px;
			height: 250px;
			background: linear-gradient(321.03deg, #4daf94 0%, #3b8e76 91.45%);
			border-top-left-radius: 100%;

			&::before {
				content: '';
				position: absolute;
				top: -20px;
				right: -80px;
				width: 380px;
				height: 250px;
				background: linear-gradient(321.03deg, #4daf94 0%, #35816b 91.45%);
				border-top-left-radius: 100%;
			}

			&::after {
				content: '';
				position: absolute;
				top: -20px;
				right: -120px;
				width: 380px;
				height: 250px;
				background: linear-gradient(321.03deg, #4daf94 0%, rgb(46, 113, 93) 91.45%);
				border-top-left-radius: 100%;
			}
		}

		&-glow {
			position: absolute;
			top: -140px;
			left: -65px;
			height: 200px;
			width: 400px;
			background: rgba(#00b7ff, 0.4);
			filter: blur(10px);
			border-radius: 100%;
			transform: skew(-15deg, -15deg);
		}

		&-chip {
			position: absolute;
			top: 25px;
			left: 25px;
			width: 30px;
			height: 24px;
			border-radius: 5px;
			background-color: #ffda7b;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				left: 49%;
				top: -7%;
				transform: translateX(-50%);
				background: #ffda7b;
				border: 1px solid #a27c1f;
				width: 25%;
				height: 110%;
				border-radius: 100%;
				z-index: 2;
			}

			&::after {
				content: '';
				position: absolute;
				top: 30%;
				left: -10%;
				background: transparent;
				border: 1px solid #a27c1f;
				width: 120%;
				height: 33%;
			}
		}

		&-holder {
			position: absolute;
			left: 25px;
			bottom: 20px;
			color: white;
			font-size: 10px;
			letter-spacing: 0.2em;
			filter: drop-shadow(1px 1px 1px rgba(black, 0.3));
		}

		&-number {
			position: absolute;
			left: 25px;
			bottom: 45px;
			color: white;
			font-size: 12px;
			font-weight: 600;
			letter-spacing: 0.2em;
			filter: drop-shadow(1px 1px 1px rgba(black, 0.3));
		}

		&-valid {
			position: absolute;
			right: 25px;
			bottom: 20px;
			color: white;
			font-size: 11px;
			letter-spacing: 0.2em;
			filter: drop-shadow(1px 1px 1px rgba(black, 0.3));

			&::before {
				content: 'GOOD THRU';
				position: absolute;
				top: 1px;
				left: -35px;
				width: 50px;
				font-size: 6px;
			}
		}

		&-signature {
			position: absolute;
			top: 80px;
			left: 15px;
			width: 70%;
			height: 25px;
			background: rgb(238, 236, 236);
			display: flex;
			justify-content: center;
			align-items: center;
			color: #021318;
			font-size: 16px;
			font-weight: 400;

			&::before {
				content: 'Authorized Signature';
				position: absolute;
				top: -15px;
				left: 0;
				font-size: 9px;
				color: rgb(238, 236, 236);
			}
		}

		&-seccode {
			position: absolute;
			top: 85px;
			left: 190px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 40px;
			height: 17px;
			color: #021318;
			background-color: rgb(238, 236, 236);
			text-align: center;
			font-size: 11px;
		}
	}

	.logo {
		position: absolute;
		right: 25px;
		top: 15px;
	}
</style>

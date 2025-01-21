<script>
	import { fly } from 'svelte/transition';
	import { CONSOLE } from '../constants.js';

	let { publisherName = '', applicationName = '', clientID = '' } = $props();

	let showCopiedTooltip = $state(false);
</script>

<div>
	<div class="flex flex-col">
		<label for="publisher_name" class="mb-1 text-sm opacity-80">Publisher Name</label>
		<input
			id="publisher_name"
			type="text"
			name="publisher_name"
			value={publisherName}
			readonly
			disabled
			class="cursor-text border-none bg-transparent"
		/>
	</div>

	<div class="mt-4 flex flex-col">
		<label for="application_name" class="mb-1 text-sm opacity-80">Application Name</label>
		<input
			id="application_name"
			type="text"
			name="application_name"
			value={applicationName}
			readonly
			disabled
			class="cursor-text border-none bg-transparent"
		/>
	</div>

	<div class="relative mt-4 flex flex-col">
		<label for="application_name" class="mb-1 text-sm opacity-80">Client ID</label>
		{#if showCopiedTooltip}
			<span
				transition:fly={{ y: 10 }}
				class="absolute bottom-10 right-0 inline-flex h-6 w-16 items-center justify-center rounded-md bg-green-500 text-xs text-charcoal"
				>Copied</span
			>
		{/if}
		<button
			onclick={async () => {
				showCopiedTooltip = true;
				await navigator.clipboard.writeText(clientID);
				setTimeout(() => {
					showCopiedTooltip = false;
				}, 1000);
			}}
			class="group flex h-9 items-center justify-between rounded-md bg-charcoal px-3 text-left text-white dark:text-[#d4d4d4] font-mono"
		>
			{clientID}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 group-hover:stroke-2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
				/>
			</svg>
		</button>
	</div>

	<hr class="my-6 border-charcoal opacity-40 dark:border-[#808080]" />

	<p>
		Update:<br />
	</p>
	<ul class="ml-2 list-inside list-disc">
		<li><span class="-ml-1">Application Logo</span></li>
		<li><span class="-ml-1">Terms of Service</span></li>
		<li><span class="-ml-1">Privacy Policy</span></li>
	</ul>
	<a
		href={CONSOLE + "?client_id=" + clientID}
		target="_blank"
		class="mt-1.5 inline-flex items-center text-xl"
	>
		<span>Hellō Developer Console</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="ml-1 mt-1 h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
			/>
		</svg>
	</a>
</div>

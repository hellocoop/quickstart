<script>
	import { slide } from 'svelte/transition';
	import { global } from '../state.svelte.js';
</script>

<div
	class="relative flex h-9 flex-shrink-0 items-center justify-center text-sm"
	class:bg-green-500={global.notification.type === 'success'}
	class:text-charcoal={global.notification.type === 'success'}
	class:bg-red-500={global.notification.type === 'error'}
	class:text-white={global.notification.type === 'error'}
	transition:slide
>
	{global.notification.text}
	<button aria-label="Close" class="absolute right-4" onclick={() => (global.notification = null)}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</button>
</div>

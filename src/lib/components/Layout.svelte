<script>
	import Header from '$components/Header.svelte';

	let { children } = $props();
</script>

<Header />

<main class="max-w-md m-12 container mx-auto flex flex-col flex-1 px-4">
	{@render children()}
</main>

<script>
	import { onMount } from 'svelte';

	export let login = () => {};
	export let loginAjax = false;
	let darkMode = true;

	onMount(() => {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
			darkMode = false;
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			if (event.matches) {
				darkMode = true;
			} else {
				darkMode = false;
			}
		});
	});
</script>

<h1 class="text-center text-2xl font-semibold">Quickstart App</h1>
<p class="mt-4 text-center">
	Quickstart accelerates getting up and running with Hellō. It will read an existing client_id, or
	create one.
</p>

<button
	on:click={login}
	disabled={loginAjax}
	class="hello-btn-black-and-static mx-auto mt-12 w-56"
	class:hello-btn-loader={loginAjax}
	class:hello-btn-hover-flare={darkMode}
>
	ō&nbsp;&nbsp;&nbsp;Continue with Hellō
</button>

<script>
	let { login = () => {}, loginAjax = false } = $props();
</script>

<h1 class="text-center text-2xl font-semibold">Quickstart App</h1>
<p class="mt-4 text-center">
	Quickstart accelerates getting up and running with Hellō. It will read an existing client_id, or
	create one.
</p>

<button
	onclick={login}
	disabled={loginAjax}
	class="hello-btn hello-btn-black-and-static hello-btn-hover-flare mx-auto mt-12 w-56"
	class:hello-btn-loader={loginAjax}
>
	ō&nbsp;&nbsp;&nbsp;Continue with Hellō
</button>

<script>
	import Router from 'svelte-spa-router';
	import routes from '$lib/pages/index.js';
	import Layout from '$components/Layout.svelte';
</script>

<Layout>
	<Router {routes} />
</Layout>

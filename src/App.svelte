<script>
	import { onMount } from 'svelte';
	import { getAccessToken, getProfile } from './api.js';
	import { global } from './state.svelte.js';
	import { cleanUrl, readWriteSessionStorageOp } from './util.js';
	import { AUTHORIZATION_SERVER, CONFIG } from './constants.js';
	import { pkceChallenge } from '@hellocoop/helper-browser';
	import Header from './lib/Header.svelte';
	import Login from './lib/Login.svelte';
	import CreatePublisher from './lib/CreatePublisher.svelte';
	import SelectPublisher from './lib/SelectPublisher.svelte';
	import SelectApp from './lib/SelectApp.svelte';
	import SelectedApp from './lib/SelectedApp.svelte';
	import PageLoadSpinner from './lib/PageLoadSpinner.svelte';
	import Notification from './lib/Notification.svelte';

	let mounted = $state(false);
	onMount(async () => {
		//remove html spinner
		document.querySelector('#load-spinner')?.remove();

		readWriteSessionStorageOp();

		const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
		const code = fragmentParams.get('code');
		if (code) {
			try {
				const access_token = await getAccessToken(code);
				if (!access_token) {
					throw new Error('Access token not found');
				}
				sessionStorage.setItem('access_token', access_token);
			} catch (err) {
				console.error(err);
				global.notification = {
					text: 'Something went wrong. Please try again.',
					type: 'error'
				};
			} finally {
				cleanUrl();
				sessionStorage.removeItem('code_verifier');
			}
		}

		if (window.location.search) {
			const queryParams = new URLSearchParams(window.location.search);
			queryParams.forEach((value, key) => {
				sessionStorage.setItem(key, value);
			});

			//DEBUG LOG
			const logObj = {};
			for (const [key, value] of queryParams.entries()) {
				logObj[key] = value;
			}
			console.log('Query Params:', JSON.stringify(logObj, null, 2));
			//DEBUG LOG

			cleanUrl();

			return login();
		}

		if (sessionStorage.getItem('access_token')) {
			try {
				global.data = await getProfile();
			} catch (err) {
				console.error(err);
				sessionStorage.clear();
			}
		}

		mounted = true;
	});

	let loginAjax = $state(false);
	async function login() {
		try {
			loginAjax = true;
			const { code_verifier, code_challenge } = await pkceChallenge();
			sessionStorage.setItem('code_verifier', code_verifier);
			const uri = new URL(AUTHORIZATION_SERVER);
			uri.search = new URLSearchParams(CONFIG).toString();
			uri.searchParams.set('code_challenge', code_challenge);
			if (sessionStorage.provider_hint)
				uri.searchParams.set('provider_hint', sessionStorage.provider_hint);
			window.location.href = uri.href;
		} catch (err) {
			console.error(err);
			loginAjax = false;
		}
	}
</script>

{#if mounted}
	<Header />
{/if}

{#if global.notification != null}
	<Notification />
{/if}

<main class="container m-12 mx-auto flex max-w-md flex-1 flex-col px-4">
	{#if mounted}
		{#if global.showSelectedApp}
			<SelectedApp
				publisherName={global.selectedAppData.pub_name}
				applicationName={global.selectedAppData.app_name}
				clientID={global.selectedAppData.client_id}
			/>
		{:else if global.data?.profile}
			{#if !global.data.publishers?.length}
				<CreatePublisher />
			{/if}

			{#if global.data.publishers?.length > 1}
				<SelectPublisher />
			{/if}

			{#if global.data.currentPublisher != null}
				<SelectApp />
			{/if}
		{:else}
			<Login {loginAjax} {login} />
		{/if}
	{:else}
		<PageLoadSpinner />
	{/if}
</main>

{#if mounted}
	<wc-footer></wc-footer>
{/if}

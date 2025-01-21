<script>
	import { onMount } from 'svelte';
	import { getAccessToken, getProfile } from './api.js';
	import { data, notification, showSelectedApp, selectedAppData } from './store.js';
	import { readWriteSessionStorageOp } from './util.js';
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
		readWriteSessionStorageOp();

		const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
		const code = fragmentParams.get('code');
		if (code) {
			try {
				const access_token = await getAccessToken(code);
				sessionStorage.setItem('access_token', access_token);
				window.location.replace('#');
				if (typeof window.history.replaceState == 'function') {
					history.replaceState({}, '', window.location.href.slice(0, -1));
				}
			} catch (err) {
				console.error(err);
				return;
			} finally {
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

			window.history.pushState({}, document.title, '/');
			login();
			return;
		}

		if (sessionStorage.getItem('access_token')) {
			try {
				const res = await getProfile();
				$data = res;

				//DEBUG LOG
				console.log('Session Storage:', JSON.stringify(sessionStorage, null, 2));
				//DEBUG LOG
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

{#if $notification != null}
	<Notification notification={$notification} />
{/if}

<main data-test="test-run-8" class="container m-12 mx-auto flex max-w-md flex-1 flex-col px-4">
	{#if mounted}
		{#if $showSelectedApp}
			<SelectedApp
				publisherName={$selectedAppData.pub_name}
				applicationName={$selectedAppData.app_name}
				clientID={$selectedAppData.client_id}
			/>
		{:else if $data != null}
			{#if !$data.publishers?.length}
				<CreatePublisher />
			{/if}

			{#if $data.publishers.length > 1}
				<SelectPublisher />
			{/if}

			{#if $data.currentPublisher != null}
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

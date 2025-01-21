<script>
	import { onMount } from 'svelte';
	import Header from './lib/Header.svelte';
	import Login from './lib/Login.svelte';
	import CreatePublisher from './lib/CreatePublisher.svelte';
	import SelectPublisher from './lib/SelectPublisher.svelte';
	import SelectApp from './lib/SelectApp.svelte';
	import SelectedApp from './lib/SelectedApp.svelte';
	import PageLoadSpinner from './lib/PageLoadSpinner.svelte';
	import Notification from './lib/Notification.svelte';
	import { getAccessToken, getProfile } from './api.js';
	import { data, notification, showSelectedApp, selectedAppData } from './store.js';
	import { generateRandomString, pkceChallengeFromVerifier } from './util.js';
	import { AUTHORIZATION_SERVER } from './constants.js';

	let mounted = false;

	onMount(async () => {
		updateFavicon();
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
				sessionStorage.removeItem('pkce_code_verifier');
				sessionStorage.removeItem('pkce_state');
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

	function readWriteSessionStorageOp() {
		//Check if browser supports writing and reading from session storage
		//Found an edge case where Brave ignored values with "."
		const testData = 'Next.js';
		sessionStorage.setItem('testData', testData);
		if (!sessionStorage.getItem('testData')) {
			$notification = {
				text: 'Read/Write Operation to sessionStorage failed. Query Params would be ignored as a result.',
				type: 'error'
			};
		}
		sessionStorage.removeItem('testData');
	}

	function updateFavicon() {
		const ref = document.querySelector("link[rel='icon']");
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
			ref.href = 'https://cdn.hello.coop/images/quickstart-favicon-dark.png';
		}
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			if (event.matches) {
				ref.href = 'https://cdn.hello.coop/images/quickstart-favicon-dark.png';
			} else {
				ref.href = 'https://cdn.hello.coop/images/quickstart-favicon-light.png';
			}
		});
	}

	let loginAjax = false;
	async function login() {
		try {
			loginAjax = true;
			const state = generateRandomString();
			sessionStorage.setItem('pkce_state', state);
			const code_verifier = generateRandomString();
			sessionStorage.setItem('pkce_code_verifier', code_verifier);
			const code_challenge = await pkceChallengeFromVerifier(code_verifier);
			const uri = new URL(AUTHORIZATION_SERVER);
			uri.searchParams.set('client_id', 'hello_quick_start');
			uri.searchParams.set('redirect_uri', window.location.origin + '/');
			uri.searchParams.set('response_type', 'code');
			uri.searchParams.set('response_mode', 'fragment');
			uri.searchParams.set('state', '');
			uri.searchParams.set('code_challenge', encodeURIComponent(code_challenge));
			uri.searchParams.set('code_challenge_method', 'S256');
			uri.searchParams.set('scope', 'quickstart name email picture');
			if (sessionStorage.provider_hint) {
				uri.searchParams.set('provider_hint', sessionStorage.provider_hint);
			}
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
	<Notification notification={$notification} on:close={() => ($notification = null)} />
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

<!-- DEBUG CREATE PUBLISHER CODE -->
<!-- <div class="absolute bottom-20">
  <button on:click={async()=>{

    const pubRes = await postPublisher({
      name: 'asdfasdfasdsdf'
    })
  }
  }>debug create publisher</button>
  <input type="text"/>
</div> -->

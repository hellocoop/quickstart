<script>
	import { postPublisher, postApplication } from '../api.js';
	import { global } from '../state.svelte.js';
	import { createAppBody, preventDefault } from '../util.js';

	const customAppNameSuffix = sessionStorage.suffix;
	const customAppName = sessionStorage.name;
	const customTosUri = sessionStorage.tos_uri || null;
	const customPpUri = sessionStorage.pp_uri || null;
	const wildcardDomain = sessionStorage.wildcard_domain == 'true';
	const createdBy =
		'quickstart' + (sessionStorage.integration ? `|${sessionStorage.integration}` : '');

	let publisherName = $state(`${global.data?.profile?.name}'s Team`);
	let sendTosUri = $state(!!customTosUri);
	let sendPpUri = $state(!!customPpUri);
	let sendImageUri = $state(!!sessionStorage.image_uri);
	let sendDarkImageUri = $state(!!sessionStorage.dark_image_uri);
	let applicationName = $state(
		customAppName || `${global.data?.profile?.name}'s ${customAppNameSuffix || 'Application'}`
	);

	let createPubAppAjax = $state(false);
	async function createPubApp() {
		let client_id;
		try {
			createPubAppAjax = true;
			const pubRes = await postPublisher({
				name: publisherName
			});
			const postAppBody = createAppBody(applicationName, wildcardDomain, createdBy);
			if (sendTosUri) postAppBody.tos_uri = customTosUri;
			if (sendPpUri) postAppBody.pp_uri = customPpUri;
			if (sessionStorage.redirect_uri) {
				const uris = sessionStorage.redirect_uri.trim().split(' ');
				uris.forEach((uri) => {
					if (!uri.startsWith('http://localhost') && !uri.startsWith('http://127.0.0.1')) {
						postAppBody.web.prod.redirect_uris.push(uri);
					}
				});
			}
			//remove duplicate prod redirect_uris
			postAppBody.web.prod.redirect_uris = [...new Set(postAppBody.web.prod.redirect_uris)];
			if (sendImageUri && sessionStorage.image_uri)
				postAppBody.image_uri = sessionStorage.image_uri;
			if (sendDarkImageUri && sessionStorage.dark_image_uri)
				postAppBody.dark_image_uri = sessionStorage.dark_image_uri;
			const appRes = await postApplication(pubRes.profile.id, postAppBody);
			client_id = appRes.id;
		} catch (err) {
			console.error(err);
			createPubAppAjax = false;
		} finally {
			//remove so that other apps created in the same sesion does not get affected
			sessionStorage.removeItem('wildcard_domain');
			const response_uri = sessionStorage.response_uri;
			if (response_uri) {
				const uri = new URL(response_uri);
				uri.searchParams.set('client_id', client_id);
				window.location.href = uri.href;
			} else {
				global.showSelectedApp = true;
				global.selectedAppData = {
					pub_name: publisherName,
					app_name: applicationName,
					client_id
				};
				global.notification = {
					text: applicationName + ' was created',
					type: 'success'
				};
			}
		}
	}
</script>

<h1 class="text-lg font-semibold">Create Publisher & Application</h1>
<form onsubmit={preventDefault(createPubApp)} class="mt-4">
	<div class="flex flex-col">
		<label for="publisher_name" class="mb-1 text-sm opacity-80">Publisher Name</label>
		<input
			id="publisher_name"
			type="text"
			name="publisher_name"
			class="form-input"
			placeholder="enter publisher name"
			bind:value={publisherName}
		/>
	</div>

	<div class="mt-4 flex flex-col">
		<label for="application_name" class="mb-1 text-sm opacity-80">Application Name</label>
		<input
			id="application_name"
			type="text"
			name="application_name"
			class="form-input"
			placeholder="enter application name"
			bind:value={applicationName}
		/>
	</div>

	<div class="ml-3 mt-2 space-y-0.5">
		{#if sessionStorage.tos_uri}
			<div>
				<label for="terms-of-service" class="text-sm opacity-60">Terms of Service</label>
				<div class="flex items-center">
					<input
						bind:checked={sendTosUri}
						type="checkbox"
						id="terms-of-service"
						class="form-checkbox"
					/>
					<a href={customTosUri} target="_blank" class="ml-2 block">{customTosUri}</a>
				</div>
			</div>
		{/if}

		{#if sessionStorage.pp_uri}
			<div>
				<label for="privacy-policy" class="text-sm opacity-60">Privacy Policy</label>
				<div class="flex items-center">
					<input
						bind:checked={sendPpUri}
						type="checkbox"
						id="privacy-policy"
						class="form-checkbox"
					/>
					<a href={customPpUri} target="_blank" class="ml-2 block">{customPpUri}</a>
				</div>
			</div>
		{/if}

		{#if sessionStorage.image_uri}
			<div>
				<label for="logo-light-mode" class="text-sm opacity-60">Logo (Light mode)</label>
				<div class="flex items-center">
					<input
						bind:checked={sendImageUri}
						type="checkbox"
						id="logo-light-mode"
						class="form-checkbox"
					/>
					<div
						class="ml-2 mt-0.5 inline-flex h-20 w-20 items-center justify-center rounded-md bg-white p-1.5"
					>
						<img src={sessionStorage.image_uri} alt="{applicationName} light mode logo" />
					</div>
				</div>
			</div>
		{/if}

		{#if sessionStorage.dark_image_uri}
			<div>
				<label for="logo-dark-mode" class="text-sm opacity-60">Logo (Dark mode)</label>
				<div class="flex items-center">
					<input
						bind:checked={sendDarkImageUri}
						type="checkbox"
						id="logo-dark-mode"
						class="form-checkbox"
					/>
					<div
						class="ml-2 mt-0.5 inline-flex h-20 w-20 items-center justify-center rounded-md bg-[#151515] p-1.5"
					>
						<img src={sessionStorage.dark_image_uri} alt="{applicationName} dark mode logo" />
					</div>
				</div>
			</div>
		{/if}

		{#if sessionStorage.redirect_uri}
			<div>
				<label for="redirect_uri" class="text-sm opacity-60">Redirect URI(s)</label>
				{#each sessionStorage.redirect_uri.trim().split(' ') as redirect_uri}
					<span class="ml-6 block">{redirect_uri}</span>
				{/each}
			</div>
		{/if}
	</div>

	<button
		class="hello-btn-black-and-static mt-4 flex h-11 w-full items-center justify-center rounded-md border-2 border-[#808080] bg-charcoal disabled:opacity-50"
		class:hello-btn-loader={createPubAppAjax}
		disabled={createPubAppAjax || !publisherName.length || !applicationName.length}
	>
		Create
	</button>
</form>

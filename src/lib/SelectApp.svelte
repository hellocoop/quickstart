<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { postApplication, postImage, putApplication, testServerImageFetch } from '../api.js';
	import { data, notification, showSelectedApp, selectedAppData } from '../store.js';

	const customAppNameSuffix = sessionStorage.suffix;
	const customAppName = sessionStorage.name;
	const customTosUri = sessionStorage.tos_uri || null;
	const customPpUri = sessionStorage.pp_uri || null;
	const wildcardDomain = sessionStorage.wildcard_domain == 'true';

	//if wildcard_domain, only show existing apps with https://* enabled
	$: applications = $data?.currentPublisher?.applications?.filter((i) =>
		wildcardDomain ? i?.web?.dev?.wildcard_domain : true
	);

	let createdBy = 'quickstart';
	if (sessionStorage.integration) {
		createdBy += `|${sessionStorage.integration}`;
	}

	const placeholderAppName =
		customAppName || `${$data?.profile?.name}'s ${customAppNameSuffix || 'Application'}`;
	$: selectedAppID = customAppName ? 'create' : applications?.[0]?.id || 'create';
	let applicationName = $data?.currentPublisher?.applications?.find(
		(i) => i.name === placeholderAppName
	)
		? ''
		: placeholderAppName;

	$: _selectedAppData =
		$data?.currentPublisher?.applications?.find((i) => i.id === selectedAppID) || {};

	let sendTosUri, sendPpUri, sendImageUri, sendDarkImageUri;

	//only show logo in UI if server is able to fetch image_uri or dark_image_uri passed via query params
	let serverCanFetchLogo = false;
	let serverCanFetchDarkLogo = false;

	onMount(async () => {
		if (sessionStorage.image_uri) {
			try {
				await testServerImageFetch(sessionStorage.image_uri);
				serverCanFetchLogo = true;
			} catch (err) {
				console.error('Server was unable to fetch ' + sessionStorage.image_uri);
			}
		}
		if (sessionStorage.dark_image_uri) {
			try {
				await testServerImageFetch(sessionStorage.dark_image_uri);
				serverCanFetchDarkLogo = true;
			} catch (err) {
				console.error('Server was unable to fetch ' + sessionStorage.dark_image_uri);
			}
		}
	});

	$: selectedAppID,
		(() => {
			sendTosUri = !!customTosUri || !!_selectedAppData?.tos_uri;
			sendPpUri = !!customPpUri || !!_selectedAppData?.pp_uri;
			sendImageUri = !!sessionStorage.image_uri || !!_selectedAppData?.image_uri;
			sendDarkImageUri = !!sessionStorage.dark_image_uri || !!_selectedAppData?.dark_image_uri;
		})();

	async function createApp() {
		const postAppBody = {
			name: applicationName,
			tos_uri: null,
			pp_uri: null,
			image_uri: null,
			dark_image_uri: null,
			web: {
				dev: {
					localhost: true,
					'127.0.0.1': true,
					wildcard_domain: wildcardDomain,
					redirect_uris: []
				},
				prod: {
					redirect_uris: []
				}
			},
			createdBy
		};

		const pubId = $data?.currentPublisher?.profile?.id;

		let appRes;
		if (selectedAppID === 'create') {
			appRes = await postApplication(pubId, postAppBody);
			if (sendTosUri) {
				appRes.tos_uri = customTosUri || _selectedAppData.tos_uri || null;
			} else {
				appRes.tos_uri = null;
			}

			if (sendPpUri) {
				appRes.pp_uri = customPpUri || _selectedAppData.pp_uri || null;
			} else {
				appRes.pp_uri = null;
			}

			if (sessionStorage.redirect_uri) {
				const uris = sessionStorage.redirect_uri.split(' ');
				uris.forEach((uri) => {
					if (!uri.startsWith('http://localhost') && !uri.startsWith('http://127.0.0.1'))
						appRes.web.prod.redirect_uris.push(uri);
				});
			} else {
				appRes.web.prod.redirect_uris = appRes.web.prod.redirect_uris || [];
			}
			//remove duplicate prod redirect_uris
			appRes.web.prod.redirect_uris = [...new Set(appRes.web.prod.redirect_uris)];

			if (sendImageUri) {
				if (serverCanFetchLogo && sessionStorage.image_uri) {
					try {
						// const resizedImageBlob = await resizeImage(sessionStorage.image_uri)
						const image_uri = await postImage(pubId, appRes.id, sessionStorage.image_uri);
						appRes.image_uri = image_uri;
					} catch (e) {
						console.error(e);
					}
				} else {
					appRes.image_uri = _selectedAppData.image_uri || null;
				}
			} else {
				appRes.image_uri = null;
			}

			if (sendDarkImageUri) {
				if (serverCanFetchDarkLogo && sessionStorage.dark_image_uri) {
					try {
						// const resizedImageBlob = await resizeImage(
						//   sessionStorage.dark_image_uri
						// )
						const image_uri = await postImage(pubId, appRes.id, sessionStorage.dark_image_uri);
						appRes.dark_image_uri = image_uri;
					} catch (e) {
						console.error(e);
					}
				} else {
					appRes.dark_image_uri = _selectedAppData.dark_image_uri || null;
				}
			} else {
				appRes.dark_image_uri = null;
			}
		} else {
			appRes = _selectedAppData;
		}

		//remove so that other apps created in the same sesion does not get affected
		sessionStorage.removeItem('wildcard_domain');

		return await putApplication(pubId, appRes.id, appRes);
	}

	let submitAjax = false;
	async function submit() {
		let client_id;
		try {
			submitAjax = true;
			const res = await createApp();
			client_id = res.id;
		} catch (err) {
			console.error(err);
			submitAjax = false;
		} finally {
			const response_uri = sessionStorage.response_uri;
			if (response_uri) {
				const uri = new URL(response_uri);
				uri.searchParams.set('client_id', client_id);
				window.location.href = uri.href;
			} else {
				$showSelectedApp = true;
				const app_name =
					selectedAppID === 'create'
						? applicationName
						: $data?.currentPublisher?.applications?.find((i) => i.id === client_id).name;
				$selectedAppData = {
					pub_name: $data?.currentPublisher?.profile?.name,
					app_name,
					client_id
				};
				$notification = {
					text: app_name + (selectedAppID === 'create' ? ' was created' : ' was selected'),
					type: 'success'
				};
			}
		}
	}
</script>

{#if applications?.length}
	<h1 class="text-lg font-semibold">Select or Create Application</h1>
{:else}
	<h1 class="text-lg font-semibold">Create Application</h1>
{/if}
<form on:submit|preventDefault={submit} class="mt-4">
	<ul class="space-y-2">
		{#if applications?.length}
			{#each applications as application (application.id)}
				<li class="flex items-start">
					<input
						id={application.id}
						type="radio"
						class="form-radio mt-1"
						name="application_name"
						value={application.id}
						on:change={() => (selectedAppID = application.id)}
						checked={selectedAppID === application.id}
					/>
					<div class="ml-[1.7rem]">
						<label for={application.id} class="text-base">{application.name}</label>
					</div>
				</li>
			{/each}
		{/if}
		<li class="flex items-start">
			<input
				id="application_name"
				type="radio"
				class="form-radio mt-3"
				name="application_name"
				value="create"
				on:change={() => (selectedAppID = 'create')}
				checked={'create' === selectedAppID}
			/>
			<div class="flex flex-1 flex-col">
				<input
					class="form-input ml-4 flex-1"
					id="application_name"
					type="text"
					name="application_name"
					placeholder="enter application name"
					value={applicationName}
					on:focus={() => (selectedAppID = 'create')}
					on:input={(e) => {
						applicationName = e.target.value;
						selectedAppID = 'create';
					}}
				/>
				{#if selectedAppID === 'create'}
					<div class="ml-7 space-y-0.5" transition:slide|local>
						{#if sessionStorage.tos_uri}
							<div>
								<label for="terms-of-service" class="text-sm opacity-60">Terms of Service</label>
								<div class="flex items-center">
									<input
										checked={sendTosUri}
										on:change={() => (sendTosUri = !sendTosUri)}
										type="checkbox"
										id="terms-of-service"
										class="form-checkbox"
									/>
									<a href={customTosUri} target="_blank" class="ml-2 block break-all text-sm"
										>{customTosUri}</a
									>
								</div>
							</div>
						{/if}

						{#if sessionStorage.pp_uri}
							<div>
								<label for="privacy-policy" class="text-sm opacity-60">Privacy Policy</label>
								<div class="flex items-center">
									<input
										checked={sendPpUri}
										on:change={() => (sendPpUri = !sendPpUri)}
										type="checkbox"
										id="privacy-policy"
										class="form-checkbox"
									/>
									<a href={customPpUri} target="_blank" class="ml-2 block break-all text-sm"
										>{customPpUri}</a
									>
								</div>
							</div>
						{/if}

						{#if serverCanFetchLogo}
							<div>
								<label for="logo-light-mode" class="text-sm opacity-60">Logo (Light mode)</label>
								<div class="flex items-center">
									<input
										checked={sendImageUri}
										on:change={() => (sendImageUri = !sendImageUri)}
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

						{#if serverCanFetchDarkLogo}
							<div>
								<label for="logo-dark-mode" class="text-sm opacity-60">Logo (Dark mode)</label>
								<div class="flex items-center">
									<input
										checked={sendDarkImageUri}
										on:change={() => (sendDarkImageUri = !sendDarkImageUri)}
										type="checkbox"
										id="logo-dark-mode"
										class="form-checkbox"
									/>
									<div
										class="ml-2 mt-0.5 inline-flex h-20 w-20 items-center justify-center rounded-md bg-[#151515] p-1.5"
									>
										<img
											src={sessionStorage.dark_image_uri}
											alt="{applicationName} dark mode logo"
										/>
									</div>
								</div>
							</div>
						{/if}

						{#if sessionStorage.redirect_uri}
							<div>
								<label for="redirect_uri" class="text-sm opacity-60">Redirect URI(s)</label>
								{#each sessionStorage.redirect_uri.split(' ') as redirect_uri, index}
									<span class="ml-6 block break-all text-sm">{redirect_uri}</span>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</li>
	</ul>

	<button
		class="hello-btn-black-and-static mt-4 flex h-11 w-full items-center justify-center rounded-md border-2 border-[#808080] disabled:opacity-50"
		disabled={submitAjax || (selectedAppID === 'create' && !applicationName.length)}
		class:hello-btn-loader={submitAjax}
	>
		{#if selectedAppID === 'create'}
			Create
		{:else}
			Continue
		{/if}
	</button>
</form>

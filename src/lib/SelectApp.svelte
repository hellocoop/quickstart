<script>
	import { slide } from 'svelte/transition';
	import { preventDefault, createAppBody } from '../util.js';
	import { postApplication } from '../api.js';
	import { global } from '../state.svelte.js';

	const customAppNameSuffix = sessionStorage.suffix;
	const customAppName = sessionStorage.name;
	const customTosUri = sessionStorage.tos_uri || null;
	const customPpUri = sessionStorage.pp_uri || null;
	const wildcardDomain = sessionStorage.wildcard_domain == 'true';
	const placeholderAppName =
		customAppName || `${global.data?.profile?.name}'s ${customAppNameSuffix || 'Application'}`;
	const createdBy =
		'quickstart' + (sessionStorage.integration ? `|${sessionStorage.integration}` : '');

	let sendTosUri = $state(),
		sendPpUri = $state(),
		sendImageUri = $state(),
		sendDarkImageUri = $state(),
		selectedAppID = $state(),
		applicationName = $state();

	$effect(() => {
		if (global.data.currentPublisher) {
			selectedAppID = global.data.currentPublisher.applications?.[0]?.id || 'create';
			applicationName = global.data.currentPublisher.applications?.find(
				(i) => i.name === placeholderAppName
			)
				? ''
				: placeholderAppName;
		}
	});

	//if wildcard_domain, only show existing apps with https://* enabled
	const applications = $derived(
		global.data?.currentPublisher?.applications?.filter((i) =>
			wildcardDomain ? i?.web?.dev?.wildcard_domain : true
		)
	);
	const _selectedAppData = $derived(
		global.data?.currentPublisher?.applications?.find((i) => i.id === selectedAppID) || {}
	);

	$effect(() => {
		selectedAppID,
			(() => {
				sendTosUri = !!customTosUri || !!_selectedAppData?.tos_uri;
				sendPpUri = !!customPpUri || !!_selectedAppData?.pp_uri;
				sendImageUri = !!sessionStorage.image_uri || !!_selectedAppData?.image_uri;
				sendDarkImageUri = !!sessionStorage.dark_image_uri || !!_selectedAppData?.dark_image_uri;
			})();
	});

	async function createApp() {
		let appRes;
		if (selectedAppID === 'create') {
			const postAppBody = createAppBody(applicationName, wildcardDomain, createdBy);
			const pubId = global.data?.currentPublisher?.profile?.id;
			if (sendTosUri) postAppBody.tos_uri = customTosUri || _selectedAppData.tos_uri || null;
			if (sendPpUri) postAppBody.pp_uri = customPpUri || _selectedAppData.pp_uri || null;
			if (sessionStorage.redirect_uri) {
				const uris = sessionStorage.redirect_uri.split(' ');
				uris.forEach((uri) => {
					if (!uri.startsWith('http://localhost') && !uri.startsWith('http://127.0.0.1'))
						postAppBody.web.prod.redirect_uris.push(uri);
				});
			}
			//remove duplicate prod redirect_uris
			postAppBody.web.prod.redirect_uris = [...new Set(postAppBody.web.prod.redirect_uris)];
			if (sendImageUri && sessionStorage.image_uri)
				postAppBody.image_uri = sessionStorage.image_uri;
			if (sendDarkImageUri && sessionStorage.dark_image_uri)
				postAppBody.dark_image_uri = sessionStorage.dark_image_uri;
			try {
				appRes = await postApplication(pubId, postAppBody);
			} catch (err) {
				console.error(err);
				global.notification = {
					text: 'Failed to create application. Please try again.',
					type: 'error'
				};
				return;
			}
		} else {
			appRes = _selectedAppData;
		}

		//remove so that other apps created in the same sesion does not get affected
		sessionStorage.removeItem('wildcard_domain');

		return appRes;
	}

	let submitAjax = $state(false);
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

				// clear session storage
				const accessToken = sessionStorage.getItem('access_token');
				sessionStorage.clear();
				sessionStorage.setItem('access_token', accessToken);

				window.location.href = uri.href;
			} else {
				global.showSelectedApp = true;
				const app_name =
					selectedAppID === 'create'
						? applicationName
						: global.data?.currentPublisher?.applications?.find((i) => i.id === client_id).name;
				global.selectedAppData = {
					pub_name: global.data?.currentPublisher?.profile?.name,
					app_name,
					client_id
				};
				global.notification = {
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
<form onsubmit={preventDefault(submit)} class="mt-4">
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
						onchange={() => {
							selectedAppID = application.id;
						}}
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
				onchange={() => {
					selectedAppID = 'create';
				}}
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
					onfocus={() => {
						selectedAppID = 'create';
					}}
					oninput={(e) => {
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
										onchange={() => (sendTosUri = !sendTosUri)}
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
										onchange={() => (sendPpUri = !sendPpUri)}
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

						{#if sessionStorage.image_uri}
							<div>
								<label for="logo-light-mode" class="text-sm opacity-60">Logo (Light mode)</label>
								<div class="flex items-center">
									<input
										checked={sendImageUri}
										onchange={() => (sendImageUri = !sendImageUri)}
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
										checked={sendDarkImageUri}
										onchange={() => (sendDarkImageUri = !sendDarkImageUri)}
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
								{#each sessionStorage.redirect_uri.split(' ') as redirect_uri}
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

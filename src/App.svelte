<script>
  import Header from "$lib/components/Header.svelte";
  import Login from "$lib/pages/Login.svelte";
  import { onMount } from "svelte";
  import { fetchToken } from "@hellocoop/helper-browser";
  import { admin, clientId, redirectUri, wallet } from "./lib/constants";
  import { cleanUrl } from '$lib/utils.js'

  onMount(async() => {
    const { search } = window.location;
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(search || hash);

    if (params.has('code')) await processCode(params)

    const accessToken = sessionStorage.access_token
    if (accessToken) {
      const res = await fetch(new URL('/api/v1/profile', admin), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sessionStorage.access_token
        }
      })
      const json = await res.json()
    }

    cleanUrl();
  })

  async function processCode(params) {
    const code = params.get('code')
    const nonce = sessionStorage.getItem('nonce')
    const code_verifier = sessionStorage.getItem('code_verifier')
    // if (!code || !nonce || !code_verifier)
      // do something
    try {
      const tokenRes = await fetch(new URL('/oauth/token', wallet), {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: new URLSearchParams({
					code,
					client_id: clientId,
					code_verifier,
					// nonce: nonce,
					redirect_uri: redirectUri,
					grant_type: 'authorization_code'
				}).toString()
			});
			const { access_token } = await tokenRes.json();
      sessionStorage.setItem('access_token', access_token)
    } catch(err) {
       console.error(err)
    } finally {
      sessionStorage.removeItem('nonce')
      sessionStorage.removeItem('code_verifier')
    }
  }
</script>

<Header/>

<Login/>
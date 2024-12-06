<script>
  import Header from "$lib/components/Header.svelte";
  import Login from "$lib/pages/Login.svelte";
  import { onMount } from "svelte";
  import { fetchToken, parseToken } from "@hellocoop/helper-browser";
    import { clientId, redirectUri, wallet } from "./lib/constants";

  onMount(() => {
    const { search } = window.location;
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(search || hash);

    if (params.has('code')) processCode(params)
  })

  async function processCode(params) {
    const code = params.get('code')
    const nonce = sessionStorage.getItem('nonce')
    const code_verifier = sessionStorage.getItem('code_verifier')
    // if (!code || !nonce || !code_verifier)
      // do something
    try {
      const token = await fetchToken({
        client_id: clientId,
        code,
        code_verifier,
        nonce,
        redirect_uri: redirectUri,
        wallet
      })
      const { payload } = parseToken(token) 
      console.log(payload)
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
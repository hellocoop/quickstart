<script>
    import { clientId, redirectUri, wallet } from '$lib/constants.js';
    import { createAuthRequest } from '@hellocoop/helper-browser'

    let continueWithHelloAjax = false;
    async function continueWithHello() {
        try {
            continueWithHelloAjax = true;
            const { url, nonce, code_verifier } = await createAuthRequest({
                client_id: clientId,
                redirect_uri: redirectUri,
                wallet,
            })

            // save nonce and code_verifier for fetching the token later
            sessionStorage.setItem('nonce', nonce)
            sessionStorage.setItem('code_verifier', code_verifier)

            window.location.href = url;
        } catch(err) {
            console.error(err)
            continueWithHelloAjax = false;
        }
    }
</script>

<main class="max-w-md m-12 container mx-auto flex flex-col flex-1 px-4">
    <h1 class="text-2xl font-semibold text-center">Quickstart App</h1>
    <p class="text-center mt-4">
        Quickstart accelerates getting up and running with Hellō. It will read
        an existing client_id, or create one.
    </p>

    <button
        onclick={continueWithHello}
        class="hello-btn-black-and-static hello-btn-hover-flare w-56 mx-auto mt-12"
        class:hello-btn-loader={continueWithHelloAjax}
        disabled={continueWithHelloAjax}
    >
        ō&nbsp;&nbsp;&nbsp;Continue with Hellō
    </button>
</main>

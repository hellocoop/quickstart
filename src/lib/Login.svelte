<script>
  import { onMount } from "svelte"

  export let login = () => {}
  export let loginAjax = false
  let darkMode = true

  onMount(() => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      darkMode = false
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (event.matches) {
          darkMode = true
        } else {
          darkMode = false
        }
      })
  })
</script>

<h1 class="text-2xl font-semibold text-center">Quickstart App</h1>
<p class="text-center mt-4">
  Quickstart accelerates getting up and running with Hellō. It will read an
  existing client_id, or create one.
</p>

<button
  on:click={login}
  disabled={loginAjax}
  class="hello-btn-black-and-static w-56 mx-auto mt-12"
  class:hello-btn-loader={loginAjax}
  class:hello-btn-hover-flare={darkMode}
>
  ō&nbsp;&nbsp;&nbsp;Continue with Hellō
</button>

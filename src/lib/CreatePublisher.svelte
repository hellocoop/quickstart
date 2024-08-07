<script>
  import {onMount} from "svelte"
  import {
    postPublisher,
    postApplication,
    putApplication,
    postImage,
    testServerImageFetch
  } from '../api.js'
  import {data, notification, showSelectedApp, selectedAppData} from '../store.js'

  let publisherName = `${$data?.profile?.name}'s Team`
  const customAppNameSuffix = sessionStorage.suffix
  const customAppName = sessionStorage.name
  const customTosUri = sessionStorage.tos_uri || null
  const customPpUri = sessionStorage.pp_uri || null
  const wildcardDomain = sessionStorage.wildcard_domain == 'true'
  
  let sendTosUri = !!customTosUri
  let sendPpUri = !!customPpUri
  let sendImageUri = !!sessionStorage.image_uri
  let sendDarkImageUri = !!sessionStorage.dark_image_uri

  let createdBy = 'quickstart'
  if(sessionStorage.integration){
    createdBy += `|${sessionStorage.integration}`
  }
  let applicationName = customAppName || `${$data?.profile?.name}'s ${customAppNameSuffix || 'Application'}`

  //only show logo in UI if server is able to fetch image_uri or dark_image_uri passed via query params
  let serverCanFetchLogo = false;
  let serverCanFetchDarkLogo = false;

  onMount(async() => {
    if(sessionStorage.image_uri) {
      try {
        await testServerImageFetch(sessionStorage.image_uri)
        serverCanFetchLogo = true
      } catch(err) {
        console.error("Server was unable to fetch " + sessionStorage.image_uri)
      }
    }
    if(sessionStorage.dark_image_uri) {
      try {
        await testServerImageFetch(sessionStorage.dark_image_uri)
        serverCanFetchDarkLogo = true
      } catch(err) {
        console.error("Server was unable to fetch " + sessionStorage.dark_image_uri)
      }
    }
  })

  let createPubAppAjax = false
  async function createPubApp(){
    let client_id;
    try{
      createPubAppAjax = true
      const pubRes = await postPublisher({
        name: publisherName
      })
      const postAppBody = {
        name: applicationName,
        tos_uri: null,
        pp_uri: null,
        image_uri: null,
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
      }
      if(sendTosUri) {
        postAppBody.tos_uri = customTosUri
      }
      if(sendPpUri) {
        postAppBody.pp_uri = customPpUri
      }
      if(sessionStorage.redirect_uri) {
        const uris = Array.from(sessionStorage.redirect_uri.split(' '))
        uris.forEach( uri => {
          if (!uri.startsWith('http://localhost') && !uri.startsWith('http://127.0.0.1')) {
            postAppBody.web.prod.redirect_uris.push(uri)
          }
        })
      }

      const appRes = await postApplication(pubRes.profile.id, postAppBody)
      if((serverCanFetchLogo && sendImageUri) || (serverCanFetchDarkLogo && sendDarkImageUri)){
        if(serverCanFetchLogo && sendImageUri) {
          try {
            // const resizedImageBlob = await resizeImage(sessionStorage.image_uri)
            const image_uri = await postImage(pubRes.profile.id, appRes.id, sessionStorage.image_uri) 
            appRes.image_uri = image_uri
          } catch(e) {
            console.error(e)
          } 
        }
        if(serverCanFetchDarkLogo && sendDarkImageUri) {
          try {
            // const resizedImageBlob = await resizeImage(sessionStorage.dark_image_uri)
            const image_uri = await postImage(pubRes.profile.id, appRes.id, sessionStorage.dark_image_uri) 
            appRes.dark_image_uri = image_uri
          } catch(e) {
            console.error(e)
          }
        } 
        const updateApp = await putApplication(pubRes.profile.id, appRes.id, appRes)
      }
      client_id = appRes.id
    } catch(err){      
      console.error(err)
      createPubAppAjax = false
    } finally {
      //remove so that other apps created in the same sesion does not get affected
      sessionStorage.removeItem('wildcard_domain')
      const response_uri = sessionStorage.response_uri
      if(response_uri){
        const uri = new URL(response_uri)
        uri.searchParams.set('client_id', client_id)
        window.location.href = uri.href
      } else{
        $showSelectedApp = true
        $selectedAppData = {
          pub_name: publisherName,
          app_name: applicationName,
          client_id  
        }
        $notification = {
          text: applicationName + ' was created',
          type: 'success'
        }
      }
    }
  }
</script>

<h1 class="text-lg font-semibold">Create Publisher & Application</h1>
<form on:submit|preventDefault={createPubApp} class="mt-4">
  <div class="flex flex-col">
    <label for="publisher_name" class="opacity-80 text-sm mb-1">Publisher Name</label>
    <input id="publisher_name" type="text" name="publisher_name" class="form-input" placeholder="enter publisher name" 
      bind:value={publisherName}
    >
  </div>

  <div class="mt-4 flex flex-col">
    <label for="application_name" class="opacity-80 text-sm mb-1">Application Name</label>
    <input id="application_name" type="text" name="application_name" class="form-input" placeholder="enter application name" 
      bind:value={applicationName}
    >
  </div>

  <div class="mt-2 ml-3 space-y-0.5">
    {#if sessionStorage.tos_uri}
      <div>
        <label for="terms-of-service" class="text-sm opacity-60">Terms of Service</label>
        <div class="flex items-center">
          <input bind:checked={sendTosUri} type="checkbox" id="terms-of-service" class="form-checkbox" />
          <a href={customTosUri} target="_blank" class="block ml-2">{customTosUri}</a>
        </div>
      </div>
    {/if}

    {#if sessionStorage.pp_uri}
      <div>
        <label for="privacy-policy" class="text-sm opacity-60">Privacy Policy</label>
        <div class="flex items-center">
          <input bind:checked={sendPpUri} type="checkbox" id="privacy-policy" class="form-checkbox" />
          <a href={customPpUri} target="_blank" class="block ml-2">{customPpUri}</a>
        </div>
      </div>
    {/if}

    {#if serverCanFetchLogo}
      <div>
        <label for="logo-light-mode" class="text-sm opacity-60">Logo (Light mode)</label>
        <div class="flex items-center">
          <input bind:checked={sendImageUri} type="checkbox" id="logo-light-mode" class="form-checkbox" />
          <div class="bg-white w-20 h-20 rounded-md inline-flex items-center justify-center ml-2 p-1.5 mt-0.5">
            <img src={sessionStorage.image_uri} alt="{applicationName} light mode logo" />
          </div>
        </div>
      </div>
    {/if}

    {#if serverCanFetchDarkLogo}
      <div>
        <label for="logo-dark-mode" class="text-sm opacity-60">Logo (Dark mode)</label>
        <div class="flex items-center">
          <input bind:checked={sendDarkImageUri} type="checkbox" id="logo-dark-mode" class="form-checkbox" />
          <div class="bg-[#151515] w-20 h-20 rounded-md inline-flex items-center justify-center ml-2 p-1.5 mt-0.5">
            <img src={sessionStorage.dark_image_uri} alt="{applicationName} dark mode logo" />
          </div>
        </div>
      </div>
    {/if}

    {#if sessionStorage.redirect_uri}
      <div>
        <label for="redirect_uri" class="text-sm opacity-60">Redirect URI(s)</label>
        {#each sessionStorage.redirect_uri.split(' ') as redirect_uri, index}
          <span class="block ml-6">{redirect_uri}</span>
        {/each}
      </div>
    {/if}
  </div>
  
  <button
    class="hello-btn-black-and-static bg-charcoal w-full flex items-center justify-center rounded-md mt-4 h-11 border-2 border-[#808080] disabled:opacity-50"
    class:hello-btn-loader={createPubAppAjax}
    disabled={createPubAppAjax || !publisherName.length || !applicationName.length}
  >
    Create
  </button>
</form>
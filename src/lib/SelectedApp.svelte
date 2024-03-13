<script>
    import {fly} from 'svelte/transition'
    export let publisherName = ''
    export let applicationName = ''
    export let clientID = ''

    let showCopiedTooltip = false
</script>

<div>
    <div class="flex flex-col">
      <label for="publisher_name" class="opacity-80 text-sm mb-1">Publisher Name</label>
      <input id="publisher_name" type="text" name="publisher_name"
        value={publisherName}
        readonly 
        disabled 
        class="border-none cursor-text bg-transparent" 
      >
    </div>

    <div class="mt-4 flex flex-col">
      <label for="application_name" class="opacity-80 text-sm mb-1">Application Name</label>
      <input id="application_name" type="text" name="application_name" 
        value={applicationName}
        readonly 
        disabled 
        class="border-none cursor-text bg-transparent" 
      >
    </div>

    <div class="mt-4 flex flex-col relative">
      <label for="application_name" class="opacity-80 text-sm mb-1">Client ID</label>
      {#if showCopiedTooltip}
        <span transition:fly={{y: 10}} class="bg-green-500 text-charcoal text-xs rounded-md inline-flex items-center justify-center w-16 h-6 absolute right-0 bottom-10">Copied</span>
      {/if}
      <button on:click={async()=>{
        showCopiedTooltip = true
        await navigator.clipboard.writeText(clientID)
        setTimeout(()=>{
          showCopiedTooltip = false
        }, 1000)
      }} class="group bg-charcoal rounded-md h-9 text-left px-3 flex items-center justify-between text-white dark:text-[#d4d4d4]">
        {clientID}
        <svg xmlns="http://www.w3.org/2000/svg" class="group-hover:stroke-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>

    <hr class="my-6 opacity-40 border-charcoal dark:border-[#808080]" />

    <p>
      Update:<br/>
    </p>
    <ul class="list-disc list-inside ml-2">
      <li><span class="-ml-1">Application Logo</span></li>
      <li><span class="-ml-1">Terms of Service</span></li>
      <li><span class="-ml-1">Privacy Policy</span></li>
    </ul>
    <a href="https://console.hello.coop" target="_blank" class="inline-flex items-center mt-1.5 text-xl">
      <span>Hellō Developer Console</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  </div>
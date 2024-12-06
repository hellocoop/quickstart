<script>
    let publisherName = $state("");
    let applicationName = $state("");
    let creationEnabled = $derived(
        publisherName?.trim()?.length && applicationName?.trim()?.length,
    );

    function createPublisherApplication() {
        alert(123);
    }
</script>

<h1 class="font-semibold text-lg">Create Publisher & Application</h1>
<div class="space-y-4 mt-4" on:submit={createPublisherApplication}>
    <label for="publisher-name" class="block">
        <span class="text-sm opacity-80">Publisher Name</span>
        <input
            id="publisher-name"
            class="form-input block w-full mt-1"
            bind:value={publisherName}
        />
    </label>
    <label for="application-name" class="block">
        <span class="text-sm opacity-80">Application Name</span>
        <input
            id="application-name"
            class="form-input block w-full mt-1"
            bind:value={applicationName}
        />
    </label>
    <button
        onclick={createPublisherApplication}
        disabled={!creationEnabled}
        class="hello-btn-black-and-static bg-charcoal w-full flex items-center justify-center rounded-md mt-4 border-2 border-[#808080] disabled:opacity-50 font-medium"
        >Create</button
    >
</div>

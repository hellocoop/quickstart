<script>
    import {slide} from 'svelte/transition'
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()

    export let notification = {
        text: '',
        type: 'success'
    }
</script>

<div
    class="h-12 text-charcoal flex-shrink-0 flex items-center justify-center text-sm"
    class:bg-green-500={notification.type === 'success'}
    class:bg-red-500={notification.type === 'error'}
    transition:slide
>
    {notification.text}
    <button class="absolute right-4" on:click={()=>dispatch('close')}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    </button>
</div>
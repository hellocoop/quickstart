<script>
	import { getPublisher } from '../api.js';
	import { global } from '../state.svelte.js';

	const checkedPublisherID = $derived(global.data?.currentPublisher?.profile?.id);

	const changePublisher = async (e) => {
		try {
			const publisherID = e.target.value;
			const res = await getPublisher(publisherID);
			global.data.currentPublisher = res;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<h1 class="text-lg font-semibold">Select Publisher</h1>
<form class="mb-6 mt-4">
	<ul class="space-y-2">
		{#each global.data.publishers as publisher (publisher.id)}
			<li class="flex items-center">
				<input
					onchange={changePublisher}
					id={publisher.id}
					type="radio"
					class="form-radio"
					name="publisher_name"
					value={publisher.id}
					checked={checkedPublisherID === publisher.id}
				/>
				<label for={publisher.id} class="ml-[1.7rem] text-base">{publisher.name}</label>
			</li>
		{/each}
	</ul>
</form>

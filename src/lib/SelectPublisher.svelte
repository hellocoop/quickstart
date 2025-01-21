<script>
	import { getPublisher } from '../api.js';
	import { data } from '../store.js';

	const checkedPublisherID = $derived($data?.currentPublisher?.profile?.id);

	const changePublisher = async (e) => {
		try {
			const publisherID = e.target.value;
			const res = await getPublisher(publisherID);
			$data.currentPublisher = res;
		} catch (err) {
			console.error(err);
		}
	};
</script>

<h1 class="text-lg font-semibold">Select Publisher</h1>
<form class="mb-6 mt-4">
	<ul class="space-y-2">
		{#each $data.publishers as publisher (publisher.id)}
			<li class="flex items-center">
				<input
					onchange={changePublisher}
					id="publisher_name"
					type="radio"
					class="form-radio"
					name="publisher_name"
					value={publisher.id}
					checked={checkedPublisherID === publisher.id}
				/>
				<label for="publisher_name" class="ml-[1.7rem] text-base">{publisher.name}</label>
			</li>
		{/each}
	</ul>
</form>

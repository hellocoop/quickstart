<script>
	const navLinks = [
		{
			text: 'Documentation',
			link: 'https://hello.dev/docs/'
		},
		{
			text: 'Console',
			link: 'https://console.hello.coop/'
		}
	];
</script>

<header
	class="text-white dark:text-[#d4d4d4] flex-shrink-0 bg-charcoal h-12 flex items-center justify-between px-4"
>
	<span class="w-1/3 invisible"></span>
	<span class="w-1/3 font-bold text-lg text-center">Hellō Quickstart</span>
	<ul class="w-1/3 flex space-x-4 justify-end">
		{#each navLinks as { text, link }}
			<li>
				<a href={link} target="_blank" class="inline-flex items-center">
					<span class="text-sm">{text}</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 ml-1 opacity-80"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
						/>
					</svg>
				</a>
			</li>
		{/each}
	</ul>
</header>

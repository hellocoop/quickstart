module.exports = {
	darkMode: 'media',
	content: ['./index.html', './src/**/*.{svelte,js,ts}'],
	theme: {
		extend: {
			colors: {
				charcoal: '#303030'
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'class'
		})
	]
};

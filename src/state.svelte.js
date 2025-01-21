// eslint complaints $state in *.svelte.js
// eslint-disable-next-line
export const global = $state({
	data: {},
	showSelectedApp: false,
	selectedAppData: null,
	notification: null
});

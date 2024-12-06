import Index from './Index.svelte';
import Login from './Login.svelte';
import CreatePublisherApp from './CreatePublisherApp.svelte';

export default {
	'/': Index,
	'/create-publisher-app': CreatePublisherApp,
	// The catch-all route must always be last
	'*': Login
};

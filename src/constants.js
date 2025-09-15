const parts = window.location.hostname.split('.'); // ['wallet', 'hello-staging', 'net']
parts.shift(); // ['hello-staging', 'net']
const domain = parts.join('.'); // 'hello-staging.net'

export const ADMIN_SERVER = 'https://admin.' + domain + '/';
export const AUTHORIZATION_SERVER = 'https://wallet.' + domain + '/authorize';
export const TOKEN_ENDPOINT = 'https://wallet.' + domain + '/oauth/token';
export const CONSOLE = 'https://console.' + domain;
export const CONFIG = {
	client_id: 'hello_quick_start_app',
	redirect_uri: window.location.origin + '/',
	response_mode: 'fragment',
	response_type: 'code',
	code_challenge_method: 'S256',
	scope: 'quickstart profile'
};

function cleanUrl() {
	if (window.location.search) {
		window.history.replaceState({}, document.title, '/');
	} else {
		window.location.replace('#');
		// slice off the remaining '#' in HTML5:
		if (typeof window.history.replaceState == 'function') {
			history.replaceState({}, '', window.location.href.slice(0, -1));
		}
	}
}

export { cleanUrl };

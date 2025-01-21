import { ADMIN_SERVER } from './constants';
import { notification } from './store';
import imageCompression from 'browser-image-compression';

const send = async ({ method, path, data }) => {
	const opts = { method, headers: {} };
	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}
	opts.headers['Authorization'] = `Bearer ${sessionStorage.getItem('access_token')}`;
	return fetch(ADMIN_SERVER + 'api/v1' + path, opts)
		.then((res) => {
			if (!res.ok) throw res;
			return res.json();
		})
		.catch((err) => {
			// if (err instanceof TypeError) {
			//   notification.set({
			//     text: 'Network error, please try again',
			//     type: 'error'
			//   })
			//   throw err
			// }
			// if (err.status === 401) {
			//   notification.set({
			//     text: 'Session expired',
			//     type: 'error'
			//   })
			//   sessionStorage.removeItem('token')
			// }
			// if (err.status >= 500) {
			//   notification.set({
			//     text: 'Something went wrong',
			//     type: 'error'
			//   })
			// }
			throw err;
		});
};

const get = (path) => {
	return send({ method: 'GET', path });
};

const post = (path, data) => {
	return send({ method: 'POST', path, data });
};

const put = (path, data) => {
	return send({ method: 'PUT', path, data });
};

async function resizeImage(image_path) {
	const getImage = await fetch(image_path);
	const blob = await getImage.blob();
	const options = {
		maxSizeMB: 0.14 //max size is 150kb
		// useWebWorker: true
	};
	const compressedFile = await imageCompression(blob, options);
	return compressedFile;
}

const preventDefault = (fn) => {
	return function (event) {
		event.preventDefault();
		fn.call(this, event);
	};
};

function readWriteSessionStorageOp() {
	//Check if browser supports writing and reading from session storage
	//Found an edge case where Brave ignored values with "."
	const testData = 'Next.js';
	sessionStorage.setItem('testData', testData);
	if (!sessionStorage.getItem('testData')) {
		notification.set({
			text: 'Read/Write Operation to sessionStorage failed. Query Params would be ignored as a result.',
			type: 'error'
		});
	}
	sessionStorage.removeItem('testData');
}

function createAppBody(name, wildcard_domain, createdBy) {
	return {
		name,
		tos_uri: null,
		pp_uri: null,
		image_uri: null,
		web: {
			dev: {
				localhost: true,
				'127.0.0.1': true,
				wildcard_domain,
				redirect_uris: []
			},
			prod: {
				redirect_uris: []
			}
		},
		createdBy
	};
}

const cleanUrl = () => window.history.replaceState({}, document.title, window.location.pathname);

export {
	get,
	post,
	put,
	resizeImage,
	preventDefault,
	readWriteSessionStorageOp,
	cleanUrl,
	createAppBody
};

import { ADMIN_SERVER } from "./constants"
import imageCompression from "browser-image-compression"

const generateRandomString = () => {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join(
    ''
  );
}

// Calculate the SHA256 hash of the input text.
// Returns a promise that resolves to an ArrayBuffer
const sha256 = (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

// Base64-urlencodes the input string
const base64urlencode = (str) => {
  // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
  // btoa accepts chars only within ascii 0-255 and base64 encodes them.
  // Then convert the base64 encoded to base64url encoded
  //   (replace + with -, replace / with _, trim trailing =)
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
const pkceChallengeFromVerifier = async (v) => {
  let hashed = await sha256(v);
  return base64urlencode(hashed);
}

const send = ({method, path, data}) => {
  const opts = {method, headers: {}}
  if (data) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }
  opts.headers['Authorization'] = `Bearer ${sessionStorage.getItem('access_token')}`
  return fetch(ADMIN_SERVER + 'api/v1' + path, opts)
    .then((res) => {
      if (!res.ok) throw res
      return res.json()
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
      throw err
    })
}

const get = (path) => {
  return send({method: 'GET', path})
}

const post = (path, data) => {
  return send({method: 'POST', path, data})
}

const put = (path, data) => {
  return send({method: 'PUT', path, data})
}

async function resizeImage(image_path) {
  try {
    const getImage = await fetch(image_path)
    const blob = await getImage.blob()
    const options = {
      maxSizeMB: 0.14, //max size is 150kb
      // useWebWorker: true
    }
    const compressedFile = await imageCompression(blob, options)
    return compressedFile
  } catch(e) {
    throw e
  }
}

export {
  generateRandomString,
  sha256,
  base64urlencode,
  pkceChallengeFromVerifier,
  get,
  post,
  put,
  resizeImage
}
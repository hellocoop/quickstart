import {
  get,
  post,
  put
} from './util.js'
import { ADMIN_SERVER, TOKEN_ENDPOINT } from './constants.js'

const getAccessToken = async (code) => {
  const code_verifier = sessionStorage.getItem('pkce_code_verifier')
  const params = {
    code: code,
    client_id: 'hello_quick_start',
    redirect_uri: window.location.origin + '/',
    grant_type: 'authorization_code',
    code_verifier
  }
  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params).toString()
    })
    const data = await res.json()

    return data.access_token
  } catch (err) {
    throw err
  }
}

const getProfile = () => {
  return get('/profile')
}

const postPublisher = (body) => {
  return post('/publishers', body)
}

const postApplication = (pub_id, body) => {
  return post('/publishers/' + pub_id + '/applications', body)
}

const putApplication = (pub_id, app_id, body) => {
  return put('/publishers/' + pub_id + '/applications/' + app_id, body)
}

const getPublisher = async (id) => {
  return get('/publishers/' + id)
}

const testServerImageFetch = async (imageUrl) => {
  const url = ADMIN_SERVER + `api/v1/logo/test?url=${imageUrl}`
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
      }
    })
    if (!res.ok) throw res
    return true
  } catch (err) {
    console.log(err)
    throw err;
  }
}

const postImage = async (pub_id, app_id, imageUrl) => {
  const url = ADMIN_SERVER + `api/v1/publishers/${pub_id}/applications/${app_id}/logo?url=${imageUrl}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('access_token')}`
      }
    })
    if (!res.ok) throw res
    const json = await res.json()
    return json.image_uri
  } catch (err) {
    console.log(err)
    throw err;
  }
}

export {
  getAccessToken,
  getProfile,
  postPublisher,
  postApplication,
  getPublisher,
  testServerImageFetch,
  postImage,
  putApplication
}
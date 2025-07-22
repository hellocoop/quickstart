# Quickstart App

This repo contains the source code powering [https://quickstart.hello.coop/](https://quickstart.hello.coop/).

Quickstart accelerates getting up and running with Hellō. It will read an existing client_id, or create one.

The Quickstart SPA (Single Page App) is launched by sample apps to acquire a client_id. The developer will log into Hellō and authorize Quickstart to create / read publisher / apps.

## Launching Quickstart

Load `https://quickstart.hello.coop/` with the following query parameters:

- `response_uri` - (REQUIRED) the URI that Quickstart will redirect to with the `client_id` query parameter
- `suffix` - (OPTIONAL) a string that will be appended to the suggested name (eg: John's + suffix) for an app to be created. Defaults to "Application"
- `name` - (OPTIONAL) name of the application (`suffix` param is ignored)
- `tos_uri` - (OPTIONAL) terms of service link
- `pp_uri` - (OPTIONAL) privacy policy link
- `image_uri` - (OPTIONAL) app logo link
- `dark_image_uri` - (OPTIONAL) app logo link for dark theme
- `redirect_uri` - (OPTIONAL) one or more space separated OAuth `redirect_uri` values to be added to the Production Redirect URIs. `http://localhost:*` and `http://127.0.0.1` Development Redirect URIs are enabled by default
- `integration` - (OPTIONAL) how the application is created. defaults to `quickstart`
- `wildcard_domain` - (OPTIONAL) a boolean value indicating if wildcard domains are enabled in Development Redirect URIs
- `provider_hint` - (OPTIONAL) a space separated list of recommended providers per [provider_hint](https://www.hello.dev/docs/apis/wallet/#provider_hint)

Eg: `response_uri` = `http://localhost:8000/` & `suffix` = "Next.js" 


    https://quickstart.hello.coop/?response_uri=http%3A%2F%2Flocalhost%3A8000%2F&suffix=Next.js

## Quickstart Response

On completion, the Quickstart app will load the `response_uri` with `client_id` query parameter set to the Hellō Client ID.

    http://localhost:8000/quickstart?client_id=9ca12f47-f310-413b-b70f-4428d9448e8d

## Quickstart Developer Experience

If the developer has not registered any applications, they will be prompted with a Publisher Name "John Smith's Team" and an Application Name "John Smith's Application". If a `suffix` is provided (eg. "Next.js"), then the prompt will be "John Smith's Next.js". Alternatively, the developer will choose an existing application or create a new one with the same prefilled prompt.

## Sample App Response Developer Experience 

If possible, the sample app will have a link to test out the sample app, as well as inform the developer that they can update their Hellō application at https://console.hello.coop

[MIT](LICENSE)


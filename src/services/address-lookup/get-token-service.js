/**
 * Retrieves a bearer token from the OS OAuth2 service.
 *
 * This function performs a POST request to the OS token endpoint using the Project
 * API key and Project API Secret provided in the app's config.
 * These credentials are combined into a Basic authorization header and sent
 * along with the required `grant_type=client_credentials` form parameter.
 *
 * The response included a bearer token (`access_token`) and the number of seconds
 * until it expires (`expires_in`). The `expiresAt` timestamp is calculated to
 * support token caching and renewal logic.
 *
 * This token is used to authenticate requests to the OS Places API when
 * performing address lookups.
 *
 * @module getTokenService
 */

import Wreck from '@hapi/wreck'
import { OS_PLACES_TOKEN, TOKEN_EXPIRY_BUFFER_MS } from '../../constants/cache-keys.js'
import { retry } from '../../utils/caching/retry-token.js'
import { config } from '../../config/index.js'
import { get, set } from '../../utils/caching/index.js'

const getTokenService = async (cache) => {
  return retry(() => getToken(cache), OS_PLACES_TOKEN)
}

const getToken = async (cache) => {
  const cachedToken = await get(OS_PLACES_TOKEN, cache)

  if (cachedToken) {
    return cachedToken
  }

  // No cached token, fetch a new one
  const token = await getNewToken()
  console.log('🚀 ~ token:', token)

  // Cache the token slightly less than the actual expiry to avoid using an expired token
  // Here, 60 seconds is subtracted—adjust if your expires_in is in seconds
  await set(OS_PLACES_TOKEN, token.token, (token.expiresAt * 1000) - TOKEN_EXPIRY_BUFFER_MS, cache)

  return token.token
}

/**
 * Performs the POST request to the OS OAuth2 token endpoint.
 * Constructs a URL-encoded form payload as required by the OAuth 2.0 client credentials flow.
 *
 * The OS OAuth2 service is the Authorization Server. The OS Places API is the protected
 * resource we access using this token.
 */
const getNewToken = async () => {
  const { clientId, clientSecret, tokenEndpoint } = config.get('osPlacesConfig')

  const form = new URLSearchParams({
    grant_type: 'client_credentials',
  })

  // Construct Basic auth header (base64 encode key:secret)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const { payload } = await Wreck.post(tokenEndpoint, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`
    },
    payload: form.toString(),
    json: true
  })

  console.log('🚀 ~ payload.expires_in:', payload.expires_in)

  // Combine token type and access token to create the full Authorization header value
  // e.g., "Bearer abc123xyz"
  return {
    token: `${payload.token_type} ${payload.access_token}`,
    expiresAt: payload.expires_in
  }
}

export {
  getTokenService
}

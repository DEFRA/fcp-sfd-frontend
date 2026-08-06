/**
 * Retrieves a bearer token from Azure AD (App Registration).
 *
 * This function performs a POST request to the Azure AD token endpoint using the
 * client credentials. It sends the `client_id` and `client_secret`
 * stored in the app's configuration. The response includes a bearer token
 * (`access_token`) and the number of seconds until it expires (`expires_in`).
 *
 * The token is typically valid for two hours, and the `expiresAt` timestamp is calculated
 * to assist with token caching and renewal logic.
 *
 * This token is used to authenticate requests to the DAL API.
 *
 * @module getTokenService
 */

import Wreck from '@hapi/wreck'
import { DAL_TOKEN, TOKEN_EXPIRY_BUFFER_MS } from '../../../constants/cache-keys.js'
import { retry } from './retry-service.js'
import { config } from '../../../config/index.js'
import { get, set } from '../../../utils/caching/index.js'
import { createLogger } from '../../../utils/logger.js'
import { metrics } from '../../../utils/metrics.js'

const logger = createLogger()

const getTokenService = async (cache) => {
  // Timed around the whole retry loop so the backoff waits between attempts are
  // included. This is the latency the caller actually experiences, and the figure
  // needed to confirm whether retries are responsible for slow page loads
  const startedAt = Date.now()

  try {
    return await retry(() => getToken(cache), cache)
  } finally {
    metrics.millis('dalTokenTotalTime', Date.now() - startedAt)
  }
}

/**
 * Attempts to get a token from cache first.
 * If no cached token exists, requests a new one from Azure AD.
 */
const getToken = async (cache) => {
  const cachedToken = await get(DAL_TOKEN, cache)

  if (cachedToken) {
    logger.info('#dal-token - cache hit')
    metrics.counter('dalTokenCacheHit', 1)
    return cachedToken
  }

  logger.info('#dal-token - cache miss, fetching new token from Azure AD')
  metrics.counter('dalTokenCacheMiss', 1)

  // Timed explicitly rather than with metrics.timer(), because that helper swallows
  // errors thrown by the wrapped function and resolves to undefined, which would
  // mask genuine token fetch failures from the retry logic
  const startedAt = Date.now()
  let token
  let outcome = 'success'

  try {
    token = await getNewToken()
  } catch (err) {
    outcome = 'error'
    throw err
  } finally {
    // Split by outcome so a fast failure does not skew the timings for genuine fetches
    metrics.millis('dalTokenFetchTime', Date.now() - startedAt, { outcome })
  }

  // Cache the token slightly less than the actual expiry to avoid using an expired token
  await set(DAL_TOKEN, token.token, (token.expiresAt * 1000) - TOKEN_EXPIRY_BUFFER_MS, cache)

  return token.token
}

/**
 * Performs the actual POST request to the Azure AD token endpoint.
 * Constructs a URL-encoded form payload as required by OAuth 2.0 client credentials flow.
 *
 * Azure AD is the Authorization Server. The DAL is the protected resource we
 * access using this token.
 */
const getNewToken = async () => {
  const { clientId, clientSecret, tokenEndpoint } = config.get('dalConfig')

  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: `${clientId}/.default`
  })

  const { payload } = await Wreck.post(tokenEndpoint, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    payload: form.toString(),
    json: true
  })

  // Combine token type and access token to create the full Authorization header value
  // e.g., "Bearer abc123xyz"
  // Return token and its expiry time (in ms) for caching
  return {
    token: `${payload.token_type} ${payload.access_token}`,
    expiresAt: payload.expires_in
  }
}

export {
  getTokenService
}

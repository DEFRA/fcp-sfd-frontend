/**
 * Retrieves a bearer token from the data access layer (DAL).
 *
 * This function performs a POST request to the DAL token endpoint using the
 * client credentials grant type. It sends the `client_id` and `client_secret`
 * stored in the application's configuration. The response includes a bearer token
 * (`access_token`) and the number of seconds until it expires (`expires_in`).
 *
 * The token is typically valid for two hours, and the `expiresAt` timestamp is calculated
 * to assist with token caching and renewal logic.
 *
 * @module getTokenService
 */

import { config } from '../../../config/index.js'
import Redis from 'ioredis'

const getTokenService = async () => {
  const redis = new Redis({
    host: 'redis',
    port: 6379
  })

  const dalToken = await tokenExists(redis)
  console.log('🚀 ~ dalToken:', dalToken)

  if (dalToken) {
    return dalToken
  }

  const newDalToken = await fetchNewToken()

  // Store in Redis ~ 60 seconds before the expiry time redis will automatically remove the token
  // Check do we need to set the expires at on redis since we just delete the token when it expires
  await redis.set('dal_access_token', newDalToken.token, 'EX', newDalToken.expiresAt - 60)

  return { token: newDalToken.token }
}

const fetchNewToken = async () => {
  const { clientId, clientSecret, tokenEndpoint } = config.get('dalConfig')
  const body = dalFormObject(clientId, clientSecret)

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })

  const responseBody = await response.json()

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(`Failed to fetch token: ${response.status} ${errorText}`)
  }

  return {
    token: responseBody.access_token,
    expiresAt: responseBody.expires_in
  }
}

const dalFormObject = () => {
  const form = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: `${clientId}/.default`
  })

  return form
}

const tokenExists = async (redis) => {
  const [cachedToken, cachedExpiry] = await redis.mget('dal_access_token', 'dal_access_token_expiry')

  if (cachedToken) {
    return { token: cachedToken, expiresAt: Number(cachedExpiry) }
  }

  return false
}

export {
  getTokenService
}

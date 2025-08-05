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

import { config } from '../../config/index.js'

const getTokenService = async () => {
  const clientId = config.get('dalConfig.clientId')
  const clientSecret = config.get('dalConfig.clientSecret')
  const tenantId = config.get('dalConfig.tenantId')
  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`

  const form = new URLSearchParams()
  form.append('client_id', clientId)
  form.append('client_secret', clientSecret)
  form.append('grant_type', 'client_credentials')
  form.append('scope', `${clientId}/.default`)

  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: form
  })

  const body = await response.json()

  if(!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get token: ${response.status} ${error}`)
  }

  return {
    token: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000 // 2 hours from now
  }
}

export {
  getTokenService
}

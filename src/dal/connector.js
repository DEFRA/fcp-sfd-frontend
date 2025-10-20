import { constants as httpConstants } from 'node:http2'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'
import { formatDalResponse, mapDalErrors } from './dal-response.js'
import { getTokenService } from '../services/DAL/token/get-token-service.js'
import { getTokenCache } from '../utils/caching/token-cache.js'
import { getUserSessionToken } from '../utils/get-user-session-token.js'

const logger = createLogger()

export const dalConnector = async (query, variables, request) => {
  const tokenCache = getTokenCache()

  try {
    const bearerToken = await getTokenService(tokenCache)
    const userToken = await getUserSessionToken(request)

    // Email will be replaced by defraID token
    const response = await fetch(config.get('dalConfig.endpoint'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'gateway-type': 'external',
        'x-forwarded-authorization': `User ${userToken}`,
        Authorization: `Bearer ${bearerToken}`

      },
      body: JSON.stringify({ query, variables })
    })

    const responseBody = await response.json()

    if (responseBody.errors) {
      const extendedErrors = mapDalErrors(responseBody.errors)

      return formatDalResponse({
        statusCode: extendedErrors[0]?.statusCode,
        errors: extendedErrors
      })
    }

    return formatDalResponse({
      data: responseBody.data
    })
  } catch (err) {
    logger.error(err, 'Error connecting to DAL')

    return formatDalResponse({
      statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      errors: [err]
    })
  }
}

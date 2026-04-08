/**
 * DAL connector for GraphQL requests.
 * Initialised once at server startup (`initDalConnector`) and accessed via
 * `getDalConnector()` in services. Centralises request building, token
 * resolution (`sessionId`/`forwardedUserToken`), and consistent DAL error
 * shaping.
 * @module dal-connector
 */
import { constants as httpConstants } from 'node:http2'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'
import { formatDalResponse, handleDalResponse } from './dal-response.js'
import { getTokenService } from '../services/DAL/token/get-token-service.js'

const logger = createLogger()

// Determines which user token should be sent in x-forwarded-authorization.
const resolveForwardedUserToken = async (sessionCache, sessionId, forwardedUserToken) => {
  if (forwardedUserToken) {
    return forwardedUserToken
  }

  const session = await sessionCache.get(sessionId)
  return session ? session.token : undefined
}

// Assembles the fetch options for a DAL GraphQL request.
const buildDalRequest = (bearerToken, forwardedUserToken, graphqlQuery, variables) => ({
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
    'gateway-type': 'external',
    Authorization: bearerToken,
    'x-forwarded-authorization': forwardedUserToken
  },
  body: JSON.stringify({ query: graphqlQuery, variables })
})

// Logs DAL connection failures and returns a 500-formatted DAL response.
const handleDalFailure = (err) => {
  logger.error(err, 'Error connecting to DAL')

  return formatDalResponse({
    statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    errors: [err]
  })
}

// Factory for the DAL connector; injects startup caches so services use one shared, preconfigured instance.
const createDalConnector = (sessionCache, tokenCache) => {
  if (!sessionCache) {
    throw new Error('DAL connector session cache not initialised.')
  }

  if (!tokenCache) {
    throw new Error('DAL connector token cache not initialised.')
  }

  return {
    query: async (graphqlQuery, variables, { sessionId, forwardedUserToken } = {}) => {
      try {
        const bearerToken = await getTokenService(tokenCache)

        const resolvedForwardedUserToken = await resolveForwardedUserToken(
          sessionCache,
          sessionId,
          forwardedUserToken
        )

        const requestOptions = buildDalRequest(
          bearerToken,
          resolvedForwardedUserToken,
          graphqlQuery,
          variables
        )

        const response = await fetch(config.get('dalConfig.endpoint'), requestOptions)

        const responseBody = await response.json()
        const result = handleDalResponse(responseBody)

        if (result.errors) {
          logger.error('DAL responded with errors', result)
        }

        return result
      } catch (err) {
        return handleDalFailure(err)
      }
    }
  }
}

// Stores the single connector instance used by the app. Populated once at server startup.
let instance = null

// Called once during server startup.
const initDalConnector = (sessionCache, tokenCache) => {
  instance = createDalConnector(sessionCache, tokenCache)
  return instance
}

// Returns the shared DAL connector after server startup initialises it.
const getDalConnector = () => {
  if (!instance) {
    throw new Error('DAL connector not initialised. Call initDalConnector during server startup first.')
  }
  return instance
}

export {
  initDalConnector,
  getDalConnector
}

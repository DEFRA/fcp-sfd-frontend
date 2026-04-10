/**
 * DAL connector used to make GraphQL requests to the DAL service.
 *
 * This file is initialised once when the server starts (`initDalConnector`)
 * and then reused throughout the app via `getDalConnector()`.
 *
 * It is responsible for:
 * - Sending GraphQL requests to the DAL
 * - Getting the correct authentication tokens
 * - Resolving the correct user token (session or forwarded token)
 * - Building and sending the HTTP request
 * - Handling and formatting DAL responses and errors
 *
 * All services use this shared connector so DAL requests are consistent
 * across the application.
 *
 * @module dalConnector
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

  // We create the query function here and give it access to sessionCache and tokenCache.
  // It remembers these values, so they don’t need to be passed in every time query is used
  // [closure https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures].
  const query = createQueryFunction(sessionCache, tokenCache)

  return { query }
}

// Creates a query function that already has access to sessionCache and tokenCache.
// These values are "remembered", so we don’t need to pass them in every time.
// When the returned function is called, it runs the DAL query and handles any errors.
const createQueryFunction = (sessionCache, tokenCache) => {
  return async (graphqlQuery, variables, options = {}) => {
    const { sessionId, forwardedUserToken } = options

    try {
      return await executeDalQuery(
        graphqlQuery,
        variables,
        sessionCache,
        tokenCache,
        sessionId,
        forwardedUserToken
      )
    } catch (err) {
      return handleDalFailure(err)
    }
  }
}

const executeDalQuery = async (graphqlQuery, variables, sessionCache, tokenCache, sessionId, forwardedUserToken) => {
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
}

// Initialises the instance variable that then gets overwritten during the server startup
let instance = null

/**
 * initDalConnector is called during the server startup to create and store the single DAL connector instance used
 * by the app. It takes the session cache and token cache as parameters, which are necessary for the DAL connector to
 * function properly. The function returns the initialized DAL connector instance.
 *
 * @returns instance
 */
const initDalConnector = (sessionCache, tokenCache) => {
  instance = createDalConnector(sessionCache, tokenCache)

  return instance
}

/**
 * When the server is initialised, it calls `initDalConnector` to create a single instance of the DAL connector,
 * which is stored in the `instance` variable.
 * The `getDalConnector` function is then used by services to access this shared instance. If `getDalConnector` is
 * called before the server has been initialised and the instance created, it throws an error to prevent usage of an
 * uninitialised connector.
 *
 * The instance variable is private to this module, ensuring that all services use the same DAL connector instance
 * created at startup.
 *
 * @returns instance
 */
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

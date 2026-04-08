/**
 * Wrapper for talking to the DAL
 * @module dal-connector
 *
 * This module lets the rest of the app ask for data without worrying about
 * login details or error formatting.
 *
 * It collects the right tokens in the background, sends the request,
 * and then returns results in a consistent, easy‑to‑handle shape.
 *
 * We create one shared instance when the app starts
 */
import { constants as httpConstants } from 'node:http2'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'
import { formatDalResponse, handleDalResponse } from './dal-response.js'
import { getTokenService } from '../services/DAL/token/get-token-service.js'

const logger = createLogger()

// Determines which user token to forward to the DAL.
const resolveForwardedToken = async (sessionCache, sessionId, defraIdToken) => {
  if (defraIdToken) {
    return defraIdToken
  }

  const sessionData = await sessionCache.get(sessionId)
  return sessionData?.token
}

// Assembles the fetch options for a DAL GraphQL request.
const buildDalRequest = (bearerToken, userToken, graphqlQuery, variables) => ({
  method: 'POST',
  headers: {
    'Content-type': 'application/json',
    'gateway-type': 'external',
    Authorization: bearerToken,
    'x-forwarded-authorization': userToken
  },
  body: JSON.stringify({ query: graphqlQuery, variables })
})

// Handles errors that prevent a DAL response from being received.
// Logs the error and returns a 500 DAL failure shape.
const handleDalFailure = (err) => {
  logger.error(err, 'Error connecting to DAL')

  return formatDalResponse({
    statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
    errors: [err]
  })
}

// Creates a DAL connector bound to the provided session and token caches.
const createDalConnector = (sessionCache, tokenCache) => {
  if (!sessionCache) {
    throw new Error('DAL connector session cache not initialised.')
  }

  if (!tokenCache) {
    throw new Error('DAL connector token cache not initialised.')
  }

  const query = async (graphqlQuery, variables, sessionId, defraIdToken = null) => {
    try {
      const bearerToken = await getTokenService(tokenCache)

      const userToken = await resolveForwardedToken(
        sessionCache,
        sessionId,
        defraIdToken
      )

      const requestOptions = buildDalRequest(bearerToken, userToken, graphqlQuery, variables)

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

  return {
    query
  }
}

// Stores the single connector instance used by the app. Populated once at server startup.
let instance = null

// Initialises the shared DAL connector.
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

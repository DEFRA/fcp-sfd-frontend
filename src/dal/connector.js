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

const resolveUserToken = async (sessionCache, sessionId) => {
  const sessionData = await sessionCache.get(sessionId)
  return sessionData?.token
}

const resolveAuthToken = async (sessionCache, sessionId, defraIdToken) => {
  if (defraIdToken) {
    return defraIdToken
  }

  return resolveUserToken(sessionCache, sessionId)
}

const createDalConnector = (sessionCache, tokenCache) => {
  if (!sessionCache) {
    throw new Error('DAL connector session cache not initialised.')
  }

  if (!tokenCache) {
    throw new Error('DAL connector token cache not initialised.')
  }

  const query = async (query, variables, sessionId, defraIdToken = null) => {
    try {
      const bearerToken = await getTokenService(tokenCache)

      const userToken = await resolveAuthToken(
        sessionCache,
        sessionId,
        defraIdToken
      )

      const response = await fetch(config.get('dalConfig.endpoint'), {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'gateway-type': 'external',
          Authorization: bearerToken,
          'x-forwarded-authorization': userToken
        },
        body: JSON.stringify({ query, variables })
      })

      const responseBody = await response.json()
      const result = handleDalResponse(responseBody)

      if (result.errors) {
        logger.error('DAL responded with errors', result)
      }

      return result
    } catch (err) {
      // Network or unexpected errors are treated as internal failures
      logger.error(err, 'Error connecting to DAL')

      return formatDalResponse({
        statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        errors: [err]
      })
    }
  }

  return { query }
}

let instance = null

const initDalConnector = (sessionCache, tokenCache) => {
  instance = createDalConnector(sessionCache, tokenCache)
  return instance
}

const getDalConnector = () => {
  if (!instance) {
    throw new Error('DAL connector not initialised.')
  }
  return instance
}

export {
  initDalConnector,
  getDalConnector
}

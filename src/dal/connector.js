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
import { formatDalResponse, mapDalErrors } from './dal-response.js'
import { getTokenService } from '../services/DAL/token/get-token-service.js'

const logger = createLogger()

class DalConnector {
  constructor (sessionCache, tokenCache) {
    if (!sessionCache) {
      throw new Error('DAL connector session cache not initialised.')
    }

    if (!tokenCache) {
      throw new Error('DAL connector token cache not initialised.')
    }

    // `this.` means “this object”; we store these values so other methods can use them.
    this.sessionCache = sessionCache
    this.tokenCache = tokenCache
  }

  async query (query, variables, sessionId, defraIdToken = null) {
    try {
      // Get a gateway token from the token cache
      const bearerToken = await getTokenService(this.tokenCache)

      // If no user token is provided, pull it from the session cache
      if (defraIdToken === null) {
        const sessionData = await this.sessionCache.get(sessionId)
        defraIdToken = sessionData?.token
      }

      const response = await fetch(config.get('dalConfig.endpoint'), {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'gateway-type': 'external',
          Authorization: bearerToken,
          'x-forwarded-authorization': defraIdToken
        },
        body: JSON.stringify({ query, variables })
      })

      const responseBody = await response.json()

      if (responseBody.errors) {
        // Normalize DAL errors into our standard API shape
        const extendedErrors = mapDalErrors(responseBody.errors)

        const formattedErrors = formatDalResponse({ statusCode: extendedErrors[0]?.statusCode, errors: extendedErrors })

        logger.error('DAL responded with errors', formattedErrors)

        return formattedErrors
      }

      return formatDalResponse({
        data: responseBody.data
      })
    } catch (err) {
      // Network or unexpected errors are treated as internal failures
      logger.error(err, 'Error connecting to DAL')

      return formatDalResponse({
        statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
        errors: [err]
      })
    }
  }
}

const createDalConnector = (sessionCache, tokenCache) => {
  return new DalConnector(sessionCache, tokenCache)
}

let instance = null

const initDalConnector = (sessionCache, tokenCache) => {
  // Create a single shared connector for the whole app
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

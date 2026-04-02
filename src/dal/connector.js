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

    this.sessionCache = sessionCache
    this.tokenCache = tokenCache
  }

  async query (query, variables, sessionId, defraIdToken = null) {
    try {
      const bearerToken = await getTokenService(this.tokenCache)

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
        const extendedErrors = mapDalErrors(responseBody.errors)

        const formattedErrors = formatDalResponse({ statusCode: extendedErrors[0]?.statusCode, errors: extendedErrors })

        logger.error('DAL responded with errors', formattedErrors)

        return formattedErrors
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
}

const createDalConnector = (sessionCache, tokenCache) => new DalConnector(sessionCache, tokenCache)

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

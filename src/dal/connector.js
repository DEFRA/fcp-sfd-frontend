import { constants as httpConstants } from 'node:http2'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'
import { formatDalResponse, mapDalErrors } from './dal-response.js'

const logger = createLogger()

export const dalConnector = async (query, variables, email) => {
  if (!email) {
    return formatDalResponse({
      statusCode: httpConstants.HTTP_STATUS_BAD_REQUEST,
      errors: [{
        message: 'DAL connection cannot be made if email header is missing'
      }]
    })
  }

  try {
    const response = await fetch(config.get('dalConfig.endpoint'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        email
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

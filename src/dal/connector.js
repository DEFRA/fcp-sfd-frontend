import { constants as httpConstants } from 'http2'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'

const logger = createLogger()

// TODO: helper for formatting repsonseBody

export const dalConnector = async (query, variables, email) => {
  if (!email) {
    return {
      data: null,
      statusCode: httpConstants.HTTP_STATUS_BAD_REQUEST,
      errors: [
        {
          message: 'DAL connection cannot be made if email header is missing'
        }
      ]
    }
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
      const extendedErrors = responseBody.errors.map(err => {
        const ext = err.extensions
        const parsedMessage = ext?.parsedBody?.message
        const statusCode = ext?.parsedBody?.statusCode || ext?.response?.status || httpConstants.HTTP_STATUS_BAD_REQUEST

        return {
          message: parsedMessage ? `${err.message}: ${parsedMessage}` : err.message,
          statusCode,
          extensions: ext
        }
      })

      return {
        data: null,
        statusCode: extendedErrors[0]?.statusCode,
        errors: extendedErrors
      }
    }

    return {
      data: responseBody.data,
      statusCode: httpConstants.HTTP_STATUS_OK,
      errors: null
    }
  } catch (err) {
    logger.error(err, 'Error connecting to DAL')

    return {
      data: null,
      statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      errors: [err]
    }
  }
}

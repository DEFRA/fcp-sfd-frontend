import { constants as httpConstants } from 'http2'
import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'

const logger = createLogger()

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
      return {
        data: null,
        statusCode: responseBody.errors[0]?.extensions?.response?.status || httpConstants.HTTP_STATUS_BAD_REQUEST,
        errors: responseBody.errors
      }
    } else {
      return {
        data: responseBody.data,
        errors: null
      }
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

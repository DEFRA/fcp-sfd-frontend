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

    const responseData = await response.json()

    return responseData.errors
      ? {
          data: null,
          statusCode: responseData.errors[0].extensions.response.status,
          errors: responseData.errors
        }
      : {
          data: responseData.data,
          errors: null
        }
  } catch (err) {
    logger.error(err, 'Error connecting to DAL')

    return {
      data: null,
      statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      errors: err
    }
  }
}

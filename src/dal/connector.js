import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'

const logger = createLogger()

export const dalConnector = async (query, variables, email) => {
  if (!email) {
    throw new Error('DAL connection cannot be made if email header is missing')
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

    return responseData
  } catch (err) {
    logger.error(err, 'Error connecting to DAL')
    throw err
  }
}

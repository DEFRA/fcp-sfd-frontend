import { createLogger } from '../utils/logger.js'
import { config } from '../config/index.js'

const logger = createLogger()

export const dalConnector = async (query) => {
  try {
    const response = await fetch(config.get('dalConfig.localDalEndpoint'), {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        email: config.get('dalConfig.localDalEmailAddress')
      },
      body: JSON.stringify({ query })
    })

    const responseData = await response.json()

    return responseData
  } catch (err) {
    logger.error(err, 'Error connecting to DAL')
  }
}

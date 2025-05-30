import { createLogger } from '../utils/logger.js'

const logger = createLogger()

export const dalConnector = async (query) => {
  try {
    const response = await fetch('http://fcp-dal-api:3005/graphql', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'email': 'test.user11@defra.gov.uk'
      },
      body: JSON.stringify({ query })
    })

    const responseData = await response.json()
    
    return responseData
  } catch (error) {
    logger.error(error, `Error connecting to DAL`)
  }
}

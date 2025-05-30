import { createLogger } from '../utils/logger.js'
import { queryBuilder } from './helper.js'

const logger = createLogger()

const query = queryBuilder(
  'business',
  'sbi: "107591843"',
  `customers {
    firstName
    lastName
  }`
)

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
    const responseBody = await response.json()
    const customerDetails = responseBody.data.business.customers
    console.log("*********", customerDetails)
    
    return responseBody
  } catch (error) {
    logger.error(error, `Error connecting to DAL`)
  }
}
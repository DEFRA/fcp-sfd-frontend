import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger()

/**
 * Fetches the latest business details from the DAL and merges in a temporary change stored in the user's session
 * for a specific field like businessEmail, businessAddress, businessPhoneNumbers, businessName
 *
 * For example, if the user has typed a new business name but hasn't saved it yet, this will return
 * the fresh business details with that new name included (changeBusinessName).
 *
 * @param {object} yar - The hapi `request.yar` object
 * @param {object} credentials - The user's credentials
 * @param {string|string[]} fields - The input field(s) the user has updated that we want to fetch (if exists)
 */
const fetchBusinessChangeService = async (yar, credentials, fields) => {
  logger.info('Fetching business details with pending changes')

  let businessDetails
  try {
    businessDetails = await fetchBusinessDetailsService(credentials)
  } catch (error) {
    logger.error(error, 'Failed to fetch business details')
    throw error
  }

  const sessionData = yar.get('businessDetailsUpdate') || {}

  // Normalize to array
  const fieldsToCheck = Array.isArray(fields) ? fields : [fields]

  for (const field of fieldsToCheck) {
    if (sessionData[field] === undefined) {
      logger.info({ field }, 'No session change found for field')
    } else {
      logger.info({ field }, 'Merging session change for field')
      businessDetails[field] = sessionData[field]
    }
  }

  return businessDetails
}

export {
  fetchBusinessChangeService
}

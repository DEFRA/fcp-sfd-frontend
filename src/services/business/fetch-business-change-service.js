import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

/**
 * Fetches the latest business details from the DAL and merges in a temporary change stored in the user's session
 * for a single field (businessEmail, businessAddress, businessPhoneNumbers, businessName)
 *
 * For example, if the user has typed a new business name but hasn’t saved it yet, this will return
 * the fresh business details with that new name included (changeBusinessName).
 *
 * @param {object} yar - The hapi `request.yar` object
 * @param {object} credentials - The user's credentials
 * @param {string} field - The input field the user has updated that we want to fetch (if exists)
 */
const fetchBusinessChangeService = async (yar, credentials, fields) => {
  const businessDetails = await fetchBusinessDetailsService(credentials)
  console.log('🚀 ~ businessDetails:', businessDetails)
  const sessionData = yar.get('businessDetails') || {}
  console.log('🚀 ~ sessionData:', sessionData)

  if (Array.isArray(fields)) {
    fields.forEach((field) => {
      if (sessionData[field] !== undefined) {
        businessDetails[field] = sessionData[field]
      }
    })
  } else {
    if (sessionData[fields] !== undefined) {
      businessDetails[fields] = sessionData[fields]
    }
  }

  return businessDetails
}

export {
  fetchBusinessChangeService
}

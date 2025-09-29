import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'

/**
 * Fetches the latest personal details from the DAL and merges in a temporary change stored in the user's session
 * for a single field (personalName, personalAddress, personalEmail, personalPhoneNumbers
 *
 * For example, if the user has typed a new personal email address but hasn't saved it yet, this will return
 * the fresh personal details with that new email address included (changePersonalEmail).
 *
 * @param {object} yar - The hapi `request.yar` object
 * @param {object} credentials - The user's credentials
 * @param {string} field - The input field the user has updated that we want to fetch (if exists)
 */
const fetchPersonalChangeService = async (yar, credentials, field) => {
  const personalDetails = await fetchPersonalDetailsService(credentials)
  const sessionData = yar.get('personalDetails') || {}

  if (sessionData[field] !== undefined) {
    personalDetails[field] = sessionData[field]
  }

  return personalDetails
}

export {
  fetchPersonalChangeService
}

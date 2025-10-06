import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'

/**
 * Fetches the latest personal details from the DAL and merges in a temporary change stored in the user's session
 * for a specific field like personalName, personalAddress, personalEmail, personalPhoneNumbers
 *
 * For example, if the user has typed a new personal email address but hasn't saved it yet, this will return
 * the fresh personal details with that new email address included (changePersonalEmail).
 *
 * @param {object} yar - The hapi `request.yar` object
 * @param {object} credentials - The user's credentials
 * @param {string|string[]} fields - The input field(s) the user has updated that we want to fetch (if exists)
 */
const fetchPersonalChangeService = async (yar, credentials, fields) => {
  const personalDetails = await fetchPersonalDetailsService(credentials)
  const sessionData = yar.get('personalDetails') || {}

  // Normalise to array
  const fieldsToCheck = Array.isArray(fields) ? fields : [fields]

  for (const field of fieldsToCheck) {
    if (sessionData[field] !== undefined) {
      personalDetails[field] = sessionData[field]
    }
  }

  return personalDetails
}

export {
  fetchPersonalChangeService
}

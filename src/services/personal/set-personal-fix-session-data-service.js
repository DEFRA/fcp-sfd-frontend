/**
 * Stores the Personal Fix data on the session
 * @module setPersonalFixSessionDataService
 */

import { PERSONAL_SECTION_FIELD_ORDER } from '../../constants/interrupter-journey.js'

/**
 * Maps personal fix payload data into the session
 * based on the ordered sections to fix.
 */
const setPersonalFixSessionDataService = (yar, sessionData, payload) => {
  const personalFixUpdates = {}

  // Loop through each section that needs fixing (e.g. name, email)
  for (const section of sessionData.orderedSectionsToFix) {
    const fields = PERSONAL_SECTION_FIELD_ORDER[section]

    personalFixUpdates[section] = {}

    // Loop through each field in the section (e.g. firstName, lastName)
    for (const field of fields) {
      // Map the payload value to the session data, defaulting to an empty string if not provided
      personalFixUpdates[section][field] = payload[field] ?? ''
    }
  }

  sessionData.personalFixUpdates = personalFixUpdates
  yar.set('personalDetailsValidation', sessionData)
}

export {
  setPersonalFixSessionDataService
}

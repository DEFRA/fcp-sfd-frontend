/**
 * Stores the Business Fix data on the session
 * @module setBusinessFixSessionDataService
 */

import { BUSINESS_SECTION_FIELD_ORDER } from '../../constants/interrupter-journey.js'

/**
 * Maps business fix payload data into the session
 * based on the ordered sections to fix.
 */
const setBusinessFixSessionDataService = (yar, sessionData, payload) => {
  const businessFixUpdates = {}

  // Loop through each section that needs fixing (e.g. name, email)
  for (const section of sessionData.orderedSectionsToFix) {
    const fields = BUSINESS_SECTION_FIELD_ORDER[section]
    businessFixUpdates[section] = {}

    // Loop through each field in the section (e.g. addressLine1, addressLine2)
    for (const field of fields) {
      // Map the payload value to the session data, defaulting to an empty string if not provided
      businessFixUpdates[section][field] = payload[field] ?? ''
    }
  }

  sessionData.businessFixUpdates = businessFixUpdates
  yar.set('businessDetailsValidation', sessionData)
}

export {
  setBusinessFixSessionDataService
}

/**
 * Fetches personal details and overlays any in-progress fixes from the personal
 * fix journey stored in session.
 * @module fetchPersonalFixService
 */

import { fetchPersonalDetailsService } from './fetch-personal-details-service.js'

const fetchPersonalFixService = async (credentials, sessionData = {}) => {
  // Session can be null; normalise to {} so destructuring doesn't throw 500 errors
  const safeSession = sessionData ?? {}
  const { orderedSectionsToFix, personalFixUpdates, source } = safeSession

  const personalDetails = await fetchPersonalDetailsService(credentials)

  const updatedPersonalDetails = {
    source,
    orderedSectionsToFix,
    ...personalDetails
  }

  if (!personalFixUpdates) {
    return updatedPersonalDetails
  }

  // Merge each changed section into the live details
  if (personalFixUpdates.name) {
    updatedPersonalDetails.changePersonalName = personalFixUpdates.name
  }

  if (personalFixUpdates.dob) {
    updatedPersonalDetails.changePersonalDob = personalFixUpdates.dob
  }

  if (personalFixUpdates.email) {
    updatedPersonalDetails.changePersonalEmail = personalFixUpdates.email
  }

  if (personalFixUpdates.phone) {
    updatedPersonalDetails.changePersonalPhoneNumbers = personalFixUpdates.phone
  }

  if (personalFixUpdates.address) {
    updatedPersonalDetails.changePersonalAddress = personalFixUpdates.address
  }

  return updatedPersonalDetails
}

export {
  fetchPersonalFixService
}

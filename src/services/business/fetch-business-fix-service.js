/**
 * Fetches business details and overlays any in-progress fixes from the business
 * fix journey stored in session.
 * @module fetchBusinessFixService
 */

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessFixService = async (credentials, sessionData = {}) => {
  const { orderedSectionsToFix, businessFixUpdates, source } = sessionData
  const businessDetails = await fetchBusinessDetailsService(credentials)

  const updatedBusinessDetails = {
    source,
    orderedSectionsToFix,
    ...businessDetails
  }

  if (!businessFixUpdates) {
    return updatedBusinessDetails
  }

  // Merge each changed section into the live details
  if (businessFixUpdates.name) {
    updatedBusinessDetails.changeBusinessName = businessFixUpdates.name
  }

  if (businessFixUpdates.vat) {
    updatedBusinessDetails.changeBusinessVat = businessFixUpdates.vat
  }

  if (businessFixUpdates.email) {
    updatedBusinessDetails.changeBusinessEmail = businessFixUpdates.email
  }

  if (businessFixUpdates.phone) {
    updatedBusinessDetails.changeBusinessPhoneNumbers = businessFixUpdates.phone
  }

  if (businessFixUpdates.address) {
    updatedBusinessDetails.changeBusinessAddress = businessFixUpdates.address
  }

  return updatedBusinessDetails
}

export {
  fetchBusinessFixService
}

/**
 * Fetches the existing business details data session object. If the value has been updated
 * @module fetchUpdatedBusinessDataService
 */

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchUpdatedBusinessDataService = async (yar, key) => {
  // Fetch the current business details session data
  const businessDetails = await fetchBusinessDetailsService(yar)
  console.log('🚀 businessDetails:', businessDetails)

  // Use the changed value (e.g. changeAddress) if it exists; otherwise, fall back to the original
  const updatedValue = businessDetails[`change${key}`] || businessDetails[key]

  console.log('🚀 updatedValue:', updatedValue)
  // return {
  //   ...businessDetails,
  //   { `change${key}`: updatedValue }
  // }
}

export {
  fetchUpdatedBusinessDataService
}

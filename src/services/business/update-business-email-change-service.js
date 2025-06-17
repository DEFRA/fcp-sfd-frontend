import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
/**
 * Fetches the business details associated with the logged in users business
 * @module updateBusinessEmailChangeService
 */

const updateBusinessEmailChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const businessDetails = yar.get('businessDetails')
  businessDetails.businessEmail = businessDetails.changeBusinessEmail

  yar.set('businessDetails', businessDetails)
}

export {
  updateBusinessEmailChangeService
}

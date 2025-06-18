import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
/**
 * Fetches the business details associated with the logged in users business
 * @module setBusinessEmailChangeService
 */

const setBusinessEmailChangeService = async (data, yar) => {
  await fetchBusinessDetailsService(yar)
  const businessDetails = yar.get('businessDetails')
  const changeBusinessDetails = {
    ...businessDetails,
    changeBusinessEmail: data
  }
  yar.set('businessDetails', changeBusinessDetails)
}

export {
  setBusinessEmailChangeService
}

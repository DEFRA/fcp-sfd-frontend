import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessEmailChangeService
 */

const fetchBusinessEmailChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const changeBusinessEmail = yar.get('businessDetails').changeBusinessEmail ? yar.get('businessDetails').changeBusinessEmail : yar.get('businessDetails').businessEmail
  return {
    changeBusinessEmail
  }
}

export {
  fetchBusinessEmailChangeService
}

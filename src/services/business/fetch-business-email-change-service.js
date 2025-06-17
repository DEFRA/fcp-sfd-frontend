import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessEmailChangeService
 */

const fetchBusinessEmailChangeService = async (request) => {
  await fetchBusinessDetailsService(request.yar)
  const changeBusinessEmail = request.yar.get('businessDetails').changeBusinessEmail ? request.yar.get('businessDetails').changeBusinessEmail : request.yar.get('businessDetails').businessEmail
  return {
    changeBusinessEmail
  }
}

export {
  fetchBusinessEmailChangeService
}

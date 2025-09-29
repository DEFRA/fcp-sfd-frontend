import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { getUserSessionToken } from '../../utils/get-user-session-token.js'

const fetchBusinessEmailChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, getUserSessionToken)
  const changeBusinessEmail = businessDetails.changeBusinessEmail || businessDetails.contact.email
  const updatedBusinessDetails = { ...businessDetails, changeBusinessEmail }

  yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessEmailChangeService
}

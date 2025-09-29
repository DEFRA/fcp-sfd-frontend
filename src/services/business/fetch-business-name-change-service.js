import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { getUserSessionToken } from '../../utils/get-user-session-token.js'

const fetchBusinessNameChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, getUserSessionToken)

  const changeBusinessName = businessDetails.changeBusinessName || businessDetails.info.businessName

  const updatedBusinessDetails = { ...businessDetails, changeBusinessName }

  yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessNameChangeService
}

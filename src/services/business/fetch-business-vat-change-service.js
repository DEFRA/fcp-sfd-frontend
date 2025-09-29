import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { getUserSessionToken } from '../../utils/get-user-session-token.js'

const fetchBusinessVatChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, getUserSessionToken)
  const changeBusinessVat = businessDetails.changeBusinessVat || businessDetails.info.vat
  const updatedBusinessDetails = { ...businessDetails, changeBusinessVat }

  yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessVatChangeService
}

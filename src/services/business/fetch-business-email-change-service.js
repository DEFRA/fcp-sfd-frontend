import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessEmailChangeService = async (yar, credentials, token) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, token)
  const changeBusinessEmail = businessDetails.changeBusinessEmail || businessDetails.contact.email
  const updatedBusinessDetails = { ...businessDetails, changeBusinessEmail }

  yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessEmailChangeService
}

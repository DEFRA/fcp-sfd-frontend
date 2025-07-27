import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessEmailChangeService = async (request) => {
  const businessDetails = await fetchBusinessDetailsService(request)
  const changeBusinessEmail = businessDetails.changeBusinessEmail || businessDetails.contact.email
  const updatedBusinessDetails = { ...businessDetails, changeBusinessEmail }

  request.yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessEmailChangeService
}

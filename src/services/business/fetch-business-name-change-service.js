import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessNameChangeService = async (request) => {
  const businessDetails = await fetchBusinessDetailsService(request)

  const changeBusinessName = businessDetails.changeBusinessName || businessDetails.info.businessName

  const updatedBusinessDetails = { ...businessDetails, changeBusinessName }

  request.yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessNameChangeService
}

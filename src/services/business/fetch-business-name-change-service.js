import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessNameChangeService = async (yar, credentials, token) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, token)

  const changeBusinessName = businessDetails.changeBusinessName || businessDetails.info.businessName

  const updatedBusinessDetails = { ...businessDetails, changeBusinessName }

  yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessNameChangeService
}

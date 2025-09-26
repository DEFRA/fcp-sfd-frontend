import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

const fetchBusinessVatChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessDetailsService(yar, credentials, request)
  const changeBusinessVat = businessDetails.changeBusinessVat || businessDetails.info.vat
  const updatedBusinessDetails = { ...businessDetails, changeBusinessVat }

  yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessVatChangeService
}

/**
 * Fetches the business details associated with the logged in users business
 * @module saveBusinessEmailChangeService
 */

const saveBusinessEmailChangeService = async (yar) => {
  const businessDetails = yar.get('businessDetails')
  businessDetails.businessEmail = businessDetails.changeBusinessEmail

  yar.set('businessDetails', businessDetails)
}

export {
  saveBusinessEmailChangeService
}

/**
 * Saves the confirmed business phone numbers associated with the logged in users business
 * @module saveBusinessPhoneNumbersService
 */

const saveBusinessPhoneNumbersService = async (yar) => {
  const businessDetails = yar.get('businessDetails')
  businessDetails.businessTelephone = businessDetails.changeBusinessTelephone
  businessDetails.businessMobile = businessDetails.changeBusinessMobile

  delete businessDetails.changeBusinessTelephone
  delete businessDetails.changeBusinessMobile

  yar.set('businessDetails', businessDetails)
}

export {
  saveBusinessPhoneNumbersService
}

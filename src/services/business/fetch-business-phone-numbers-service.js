/**
 * Fetches the business phone numbers associated with the logged in users business
 * @module fetchBusinessPhoneNumbersService
 */

const fetchBusinessPhoneNumbersService = async (yar) => {
  const businessDetails = yar.get('businessDetails')

  if (!businessDetails.changeBusinessTelephone && !businessDetails.changeBusinessMobile) {
    return {
      businessTelephone: businessDetails.businessTelephone,
      businessMobile: businessDetails.businessMobile
    }
  }

  return {
    businessTelephone: businessDetails.changeBusinessTelephone,
    businessMobile: businessDetails.changeBusinessMobile
  }
}

export {
  fetchBusinessPhoneNumbersService
}

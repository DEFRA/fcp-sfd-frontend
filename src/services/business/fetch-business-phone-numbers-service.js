/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessDetailsService
 */

const fetchBusinessPhoneNumbersService = async (request) => {
  const businessDetails = request.yar.get('businessDetails')
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

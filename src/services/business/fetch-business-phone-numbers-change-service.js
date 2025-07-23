import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

/**
 * Fetches business details from session and ensures `changeBusinessTelephone` and `changeBusinessMobile`
 * are set, defaulting to existing landline and mobile numbers if they are undefined.
 *
 * This function preserves `null` values, which may occur if a user has intentionally removed
 * a phone number.
 */
const fetchBusinessPhoneNumbersChangeService = async (request) => {
  const businessDetails = await fetchBusinessDetailsService(request)

  const { contact: { landline, mobile }, changeBusinessTelephone, changeBusinessMobile } = businessDetails

  const updatedBusinessDetails = {
    ...businessDetails,
    changeBusinessTelephone: changeBusinessTelephone !== undefined ? changeBusinessTelephone : landline,
    changeBusinessMobile: changeBusinessMobile !== undefined ? changeBusinessMobile : mobile
  }

  request.yar.set('businessDetails', updatedBusinessDetails)

  return updatedBusinessDetails
}

export {
  fetchBusinessPhoneNumbersChangeService
}

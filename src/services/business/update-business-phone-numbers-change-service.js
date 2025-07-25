import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessPhoneNumbersChangeService = async (request) => {
  const businessDetails = await fetchBusinessDetailsService(request)

  businessDetails.contact.landline = businessDetails.changeBusinessTelephone ?? null
  businessDetails.contact.mobile = businessDetails.changeBusinessMobile ?? null

  delete businessDetails.changeBusinessTelephone
  delete businessDetails.changeBusinessMobile

  request.yar.set('businessDetails', businessDetails)

  flashNotification(request.yar, 'Success', 'You have updated your business phone numbers')
}

export {
  updateBusinessPhoneNumbersChangeService
}

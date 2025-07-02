import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessPhoneNumbersChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const businessDetails = yar.get('businessDetails')
  businessDetails.businessPhones = businessDetails.changeBusinessPhones
  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have updated your business phones')
}

export {
  updateBusinessPhoneNumbersChangeService
}

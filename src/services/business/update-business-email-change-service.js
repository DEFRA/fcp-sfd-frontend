import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessEmailChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const businessDetails = yar.get('businessDetails')
  businessDetails.contact.email = businessDetails.changeBusinessEmail
  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have updated your business email')
}

export {
  updateBusinessEmailChangeService
}

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessEmailChangeService = async (yar) => {
  const businessDetails = await fetchBusinessDetailsService(yar)

  businessDetails.contact.email = businessDetails.changeBusinessEmail
  delete businessDetails.changeBusinessEmail

  yar.set('businessDetails', businessDetails)

  flashNotification(yar, 'Success', 'You have updated your business email')
}

export {
  updateBusinessEmailChangeService
}

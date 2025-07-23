import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessEmailChangeService = async (request) => {
  const businessDetails = await fetchBusinessDetailsService(request)

  businessDetails.contact.email = businessDetails.changeBusinessEmail
  delete businessDetails.changeBusinessEmail

  request.yar.set('businessDetails', businessDetails)

  flashNotification(request.yar, 'Success', 'You have updated your business email')
}

export {
  updateBusinessEmailChangeService
}

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessNameChangeService = async (yar) => {
  await fetchBusinessDetailsService(yar)
  const businessDetails = yar.get('businessDetails')
  businessDetails.businessName = businessDetails.changeBusinessName
  yar.set('businessDetails', businessDetails)
  flashNotification(yar, 'Success', 'You have updated your business name')
}

export {
  updateBusinessNameChangeService
}

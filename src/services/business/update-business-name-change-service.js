/**
 * Updates the business name change data
 * @module updateBusinessNameChangeService
 */

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessNameChangeService = async (yar) => {
  const businessDetails = await fetchBusinessDetailsService(yar)

  businessDetails.info.businessName = businessDetails.changeBusinessName
  delete businessDetails.changeBusinessName

  yar.set('businessDetails', businessDetails)

  flashNotification(yar, 'Success', 'You have updated your business name')
}

export {
  updateBusinessNameChangeService
}

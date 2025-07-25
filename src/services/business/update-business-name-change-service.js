/**
 * Updates the business name change data
 * @module updateBusinessNameChangeService
 */

import { fetchBusinessDetailsService } from './fetch-business-details-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updateBusinessNameChangeService = async (request) => {
  const businessDetails = await fetchBusinessDetailsService(request)

  businessDetails.info.businessName = businessDetails.changeBusinessName
  delete businessDetails.changeBusinessName

  request.yar.set('businessDetails', businessDetails)

  flashNotification(request.yar, 'Success', 'You have updated your business name')
}

export {
  updateBusinessNameChangeService
}

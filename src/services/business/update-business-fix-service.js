/**
 * Updates the business details and flashes a success notification
 * @module updateBusinessFixService
 */

import { fetchBusinessFixService } from './fetch-business-fix-service.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { mutations, services } from '@defra/fcp-sfd-frontend-engine'

const updateBusinessFixService = async (sessionData, yar, credentials) => {
  const businessDetails = await fetchBusinessFixService(credentials, sessionData)
  const variables = services.buildBusinessFixUpdateVariables(businessDetails)

  await updateDalService(mutations.updateBusinessDetails, variables, credentials.sessionId)

  yar.clear('businessDetails')

  const message = services.buildFixSuccessMessage('business', businessDetails)

  if (!message) {
    return
  }

  if (message.type === 'html') {
    flashNotification(yar, 'Success', null, message.value)
  } else {
    flashNotification(yar, 'Success', message.value)
  }
}

export {
  updateBusinessFixService
}

/**
 * Updates the business details and flashes a success notification
 * @module updateBusinessFixService
 */

import { fetchBusinessFixService } from './fetch-business-fix-service.js'
import { buildBusinessSuccessMessage } from './build-business-success-message-service.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { buildBusinessUpdateVariablesService } from './build-business-update-variables-service.js'
import { buildBusinessDetailsMutationService } from './build-business-details-mutation-service.js'

const updateBusinessFixService = async (sessionData, yar, credentials) => {
  const businessDetails = await fetchBusinessFixService(credentials, sessionData)
  const variables = buildBusinessUpdateVariablesService(businessDetails)
  const updateBusinessDetailsMutation = buildBusinessDetailsMutationService(businessDetails.orderedSectionsToFix)

  await updateDalService(updateBusinessDetailsMutation, variables, credentials.sessionId)

  yar.clear('businessDetails')

  const message = buildBusinessSuccessMessage(businessDetails)

  if (message.type === 'html') {
    flashNotification(yar, 'Success', null, message.value)
  } else {
    flashNotification(yar, 'Success', message.value)
  }
}

export {
  updateBusinessFixService
}

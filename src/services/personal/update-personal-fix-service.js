/**
 * Updates the personal details and flashes a success notification
 * @module updatePersonalFixService
 */

import { fetchPersonalFixService } from './fetch-personal-fix-service.js'
import { buildPersonalSuccessMessage } from './build-personal-success-message-service.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { buildPersonalUpdateVariablesService } from './build-personal-update-variables-service.js'
import { buildPersonalDetailsMutationService } from './build-personal-details-mutation-service.js'

const updatePersonalFixService = async (sessionData, yar, credentials) => {
  const personalDetails = await fetchPersonalFixService(credentials, sessionData)
  const variables = buildPersonalUpdateVariablesService(personalDetails)
  const updatePersonalDetailsMutation = buildPersonalDetailsMutationService(personalDetails.orderedSectionsToFix)

  await updateDalService(updatePersonalDetailsMutation, variables, credentials.sessionId)

  yar.clear('personalDetails')

  const message = buildPersonalSuccessMessage(personalDetails)

  if (message.type === 'html') {
    flashNotification(yar, 'Success', null, message.value)
  } else {
    flashNotification(yar, 'Success', message.value)
  }
}

export {
  updatePersonalFixService
}

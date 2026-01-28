/**
 * Updates the personal details and flashes a success notification
 * @module updatePersonalFixService
 */

import { fetchPersonalFixService } from './fetch-personal-fix-service.js'
import { buildPersonalSuccessMessage } from './build-personal-success-message-service.js'
import { updatePersonalDetailsMutation } from '../../dal/mutations/personal/update-personal-details.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { buildPersonalUpdateVariables } from './build-personal-update-variables-service.js'

const updatePersonalFixService = async (sessionData, yar, credentials) => {
  const personalDetails = await fetchPersonalFixService(credentials, sessionData)
  const variables = buildPersonalUpdateVariables(personalDetails)

  await updateDalService(updatePersonalDetailsMutation, variables)

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

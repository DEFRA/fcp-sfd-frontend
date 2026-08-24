/**
 * Updates the personal details and flashes a success notification
 * @module updatePersonalFixService
 */

import { fetchPersonalFixService } from './fetch-personal-fix-service.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { mutations, services } from '@defra/fcp-sfd-frontend-engine'

const updatePersonalFixService = async (sessionData, yar, credentials) => {
  const personalDetails = await fetchPersonalFixService(credentials, sessionData)
  const variables = services.buildCustomerFixUpdateVariables(personalDetails)

  await updateDalService(mutations.updateCustomerDetails, variables, credentials.sessionId)

  yar.clear('personalDetails')

  const message = services.buildFixSuccessMessage('personal', personalDetails)

  if (message.type === 'html') {
    flashNotification(yar, 'Success', null, message.value)
  } else {
    flashNotification(yar, 'Success', message.value)
  }
}

export {
  updatePersonalFixService
}

/**
 * Service to update a personal email address
 *
 * Fetches the pending personal email change from the session
 * Calls the DAL to persist the updated email using updateDalService
 * Clears the cached personal details data from the session
 * Displays a success flash notification to the user
 *
 * @module updatePersonalEmailChangeService
 */

import { updateDalService } from '../DAL/update-dal-service.js'
import { updatePersonalEmailMutation } from '../../dal/mutations/personal/update-personal-email.js'
import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'

const updatePersonalEmailChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalEmail')
  const variables = {
    input: {
      email: {
        address: personalDetails.changePersonalEmail
      },
      crn: personalDetails.crn
    }
  }

  await updateDalService(updatePersonalEmailMutation, variables, credentials.sessionId)

  yar.clear('personalDetailsUpdate')

  flashNotification(yar, 'Success', 'You have updated your personal email address')
}

export {
  updatePersonalEmailChangeService
}

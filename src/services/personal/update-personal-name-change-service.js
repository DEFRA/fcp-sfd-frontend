/**
 * Service to update a personal full name (first, last and middle)
 *
 * Fetches the pending personal name changes from the session
 * Calls the DAL to persist the updated name fields using updateDalService
 * Clears the cached personal details data from the session
 * Displays a success flash notification to the user
 *
 * @module updatePersonalNameChangeService
 */

import { updatePersonalNameMutation } from '../../dal/mutations/personal/update-personal-name.js'
import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updatePersonalNameChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalName')
  const variables = {
    input: {
      name: {
        first: personalDetails.changePersonalName.first,
        last: personalDetails.changePersonalName.last,
        middle: personalDetails.changePersonalName.middle ?? null
      },
      crn: personalDetails.crn
    }
  }

  await updateDalService(updatePersonalNameMutation, variables)

  yar.clear('personalDetails')

  flashNotification(yar, 'Success', 'You have updated your personal name')
}

export {
  updatePersonalNameChangeService
}

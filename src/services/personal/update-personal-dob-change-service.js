/**
 * Service to update personal date of birth
 *
 * Fetches the pending personal dob changes from the session
 * Calls the DAL to persist the updated date of birth using updateDalService
 * Clears the cached personal details data from the session
 * Displays a success flash notification to the user
 *
 * @module updatePersonalDobChangeService
 */

import { updatePersonalDobMutation } from '../../dal/mutations/personal/update-personal-dob.js'
import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updatePersonalDobChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalDob')

  if (!personalDetails.changePersonalDob) {
    return
  }

  const { day, month, year } = personalDetails.changePersonalDob
  const formatDatePart = (value) => String(value).padStart(2, '0')

  const variables = {
    input: {
      dateOfBirth: `${year}-${formatDatePart(month)}-${formatDatePart(day)}`,
      crn: personalDetails.crn
    }
  }

  await updateDalService(updatePersonalDobMutation, variables, credentials.sessionId)

  yar.clear('personalDetailsUpdate')

  flashNotification(yar, 'Success', 'You have updated your date of birth')
}

export {
  updatePersonalDobChangeService
}

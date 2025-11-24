/**
 * Service to update personal phone numbers (landline and mobile)
 *
 * Fetches the pending personal phone number changes from the session
 * Calls the DAL to persist the updated phone numbers using updateDalService
 * Clears the cached personal details data from the session
 * Displays a success flash notification to the user
 *
 * @module updatePersonalPhoneNumbersChangeService
 */

import { updatePersonalPhoneNumbersMutation } from '../../dal/mutations/personal/update-personal-phone-numbers.js'
import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updatePersonalPhoneNumbersChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalPhoneNumbers')
  const variables = {
    input: {
      phone: {
        landline: personalDetails.changePersonalPhoneNumbers.personalTelephone ?? null,
        mobile: personalDetails.changePersonalPhoneNumbers.personalMobile ?? null
      },
      crn: personalDetails.crn
    }
  }

  await updateDalService(updatePersonalPhoneNumbersMutation, variables, credentials.sessionId)

  yar.clear('personalDetails')

  flashNotification(yar, 'Success', 'You have updated your personal phone numbers')
}

export {
  updatePersonalPhoneNumbersChangeService
}

/**
 * Service to update a business's phone numbers (landline and mobile)
 *
 * Fetches the pending business phone number changes from the session
 * Calls the DAL to persist the updated phone numbers using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessPhoneNumbersChangeService
 */

import { updateBusinessPhoneNumbersMutation } from '../../dal/mutations/business/update-business-phone-numbers.js'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessPhoneNumbersChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessPhoneNumbers')
  const variables = {
    input: {
      phone: {
        landline: businessDetails.changeBusinessPhoneNumbers.businessTelephone ?? null,
        mobile: businessDetails.changeBusinessPhoneNumbers.businessMobile ?? null
      },
      sbi: businessDetails.info.sbi
    }
  }

  await updateDalService(updateBusinessPhoneNumbersMutation, variables, credentials.sessionId)

  yar.clear('businessDetails')

  flashNotification(yar, 'Success', 'You have updated your business phone numbers')
}

export {
  updateBusinessPhoneNumbersChangeService
}

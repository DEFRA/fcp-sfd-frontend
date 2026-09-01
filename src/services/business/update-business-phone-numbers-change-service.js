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

import { constants, mutations, utils } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessPhoneNumbersChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessPhoneNumbers')

  if (!businessDetails.changeBusinessPhoneNumbers) {
    return
  }

  const variables = utils.buildUpdateBusinessPhoneNumbersVariables(
    businessDetails.changeBusinessPhoneNumbers.businessTelephone,
    businessDetails.changeBusinessPhoneNumbers.businessMobile,
    businessDetails.info.sbi
  )

  await updateDalService(mutations.updateBusinessPhoneNumbers, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', constants.successMessages.BUSINESS_PHONE_NUMBERS)
}

export {
  updateBusinessPhoneNumbersChangeService
}

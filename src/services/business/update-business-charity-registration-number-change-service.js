/**
 * Service to update a business's charity commission registration number
 *
 * Fetches the pending charity commission registration number change from the session
 * Calls the DAL to persist the updated number using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessCharityRegistrationNumberChangeService
 */

import { mutations, utils, constants } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessCharityRegistrationNumberChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessCharityRegistrationNumber')

  if (!businessDetails.changeBusinessCharityRegistrationNumber) {
    return
  }

  // A business only ever holds one registration number, so the company number is always cleared
  const variables = utils.buildUpdateBusinessRegistrationNumbersVariables(null, businessDetails.changeBusinessCharityRegistrationNumber, businessDetails.sbi)

  await updateDalService(mutations.updateBusinessRegistrationNumbers, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', constants.successMessages.BUSINESS_CHARITY_REGISTRATION_NUMBER)
}

export {
  updateBusinessCharityRegistrationNumberChangeService
}

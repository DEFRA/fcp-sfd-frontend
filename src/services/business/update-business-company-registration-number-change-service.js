/**
 * Service to update a business's company registration number
 *
 * Fetches the pending company registration number change from the session
 * Calls the DAL to persist the updated number using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessCompanyRegistrationNumberChangeService
 */

import { mutations, utils, constants } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessCompanyRegistrationNumberChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessCompanyRegistrationNumber')

  if (!businessDetails.changeBusinessCompanyRegistrationNumber) {
    return
  }

  // A business only ever holds one registration number, so the charity number is always cleared
  const variables = utils.buildUpdateBusinessRegistrationNumbersVariables(businessDetails.changeBusinessCompanyRegistrationNumber, null, businessDetails.sbi)

  await updateDalService(mutations.updateBusinessRegistrationNumbers, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', constants.successMessages.BUSINESS_COMPANY_REGISTRATION_NUMBER)
}

export {
  updateBusinessCompanyRegistrationNumberChangeService
}

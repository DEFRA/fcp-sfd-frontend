/**
 * Service to update a business's company or charity commission registration number
 *
 * Fetches the pending registration number from the session
 * Calls the DAL to persist it using updateDalService, nulling the number that does not apply to the legal status
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessRegistrationNumberChangeService
 */

import { mutations, utils, constants } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS } from '../../constants/business-registration-number-session-fields.js'

const updateBusinessRegistrationNumberChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS)

  const isCharity = constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(String(businessDetails.legalStatusCode))

  const registrationNumber = isCharity
    ? businessDetails.changeBusinessCharityCommissionRegistrationNumber
    : businessDetails.changeBusinessCompanyRegistrationNumber

  if (!registrationNumber) {
    return
  }

  // A business only ever holds one of the two numbers, so the other is always sent as null
  const variables = isCharity
    ? utils.buildUpdateBusinessRegistrationNumbersVariables(null, registrationNumber, businessDetails.sbi)
    : utils.buildUpdateBusinessRegistrationNumbersVariables(registrationNumber, null, businessDetails.sbi)

  await updateDalService(mutations.updateBusinessRegistrationNumbers, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', getSuccessMessage(isCharity))
}

const getSuccessMessage = (isCharity) => {
  return isCharity
    ? constants.successMessages.BUSINESS_CHARITY_REGISTRATION_NUMBER
    : constants.successMessages.BUSINESS_COMPANY_REGISTRATION_NUMBER
}

export {
  updateBusinessRegistrationNumberChangeService
}

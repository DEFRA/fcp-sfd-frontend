/**
 * Service to update a personal address
 *
 * Fetches the pending personal address change from the session
 * Prepares the address variables, handling both postcode lookup (UPRN) and
 * manually entered addresses
 * Calls the DAL to persist the updated address using updateDalService
 * Clears the cached personal details data from the session
 * Displays a success flash notification to the user
 *
 * @module updatePersonalAddressChangeService
 */

import { constants, mutations, utils } from '@defra/fcp-sfd-frontend-engine'
import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updatePersonalAddressChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalAddress')

  if (!personalDetails.changePersonalAddress) {
    return
  }

  const variables = utils.buildUpdateCustomerAddressVariables(personalDetails.changePersonalAddress, personalDetails.crn)

  await updateDalService(mutations.updateCustomerAddress, variables, credentials.sessionId)

  yar.clear('personalDetailsUpdate')

  flashNotification(yar, 'Success', constants.successMessages.PERSONAL_ADDRESS)
}

export {
  updatePersonalAddressChangeService
}

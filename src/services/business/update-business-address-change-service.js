/**
 * Service to update a business's address
 *
 * Fetches the pending business address change from the session
 * Prepares the address variables, handling both postcode-lookup and manually entered addresses
 * Calls the DAL to persist the updated address using updateDalService
 * Clears the cached business details data from the session
 * Displays a success flash notification to the user
 *
 * @module updateBusinessAddressChangeService
 */

import { constants, mutations, utils } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateDalService } from '../DAL/update-dal-service.js'

const updateBusinessAddressChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessAddress')

  if (!businessDetails.changeBusinessAddress) {
    return
  }

  const variables = utils.buildUpdateBusinessAddressVariables(businessDetails.changeBusinessAddress, businessDetails.sbi)

  await updateDalService(mutations.updateBusinessAddress, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', constants.successMessages.BUSINESS_ADDRESS)
}

export {
  updateBusinessAddressChangeService
}

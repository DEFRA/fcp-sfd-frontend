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

import { fetchBusinessChangeService } from './fetch-business-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updateBusinessAddressMutation } from '../../dal/mutations/business/update-business-address.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { buildUprnAddress, buildManualAddress } from '../build-address-variables-service.js'

const updateBusinessAddressChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessAddress')

  if (!businessDetails.changeBusinessAddress) {
    return
  }

  const variables = businessAddressVariables(businessDetails)

  await updateDalService(updateBusinessAddressMutation, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', 'You have updated your business address')
}

/**
 * Prepares the address details needed to update a business address.
 *
 * There are two modes of validation in the DAL/v1:
 *
 * 1. Postcode lookup (with UPRN):
 *    If `uprn` is present, it is the primary identifier. Other address fields
 *    are included but not strictly validated.
 *
 * 2. Manually entered address (without UPRN):
 *    If there is no `uprn`, the DAL requires:
 *    - `line1`
 *    - `city`
 *    - `postalCode`
 *    - `country`
 *
 * For manual addresses, address lines are mapped as follows:
 * | User input field | DAL field |
 * |-----------------|-----------|
 * | address1        | line1     |
 * | address2        | line2     |
 * | address3        | line3     |
 * | county          | line4     |
 * | city            | city      |
 *
 * line5 is unused.
 *
 * Optional fields are normalized to ensure undefined values are sent as null.
 *
 * @param {Object} businessDetails - The business details object containing the address change
 * @returns {Object} Variables object formatted for DAL mutation
 * @private
 */
const businessAddressVariables = (businessDetails) => {
  const { sbi } = businessDetails.info
  const change = businessDetails.changeBusinessAddress

  // Base structure for the GraphQL mutation: includes the SBI (required for the mutation)
  // and sets up an empty address object that will be populated by the builder functions
  const baseVariables = {
    input: {
      sbi,
      address: {}
    }
  }

  // Business addresses use withUprn/withoutUprn structure (unlike personal addresses)
  if (change.uprn) {
    baseVariables.input.address.withUprn = buildUprnAddress(change)
  } else {
    baseVariables.input.address.withoutUprn = buildManualAddress(change)
  }

  return baseVariables
}

export {
  updateBusinessAddressChangeService
}

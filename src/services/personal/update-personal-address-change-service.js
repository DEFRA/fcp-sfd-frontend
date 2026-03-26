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

import { fetchPersonalChangeService } from './fetch-personal-change-service.js'
import { flashNotification } from '../../utils/notifications/flash-notification.js'
import { updatePersonalAddressMutation } from '../../dal/mutations/personal/update-personal-address.js'
import { updateDalService } from '../DAL/update-dal-service.js'
import { buildUprnAddress, buildManualAddress } from '../build-address-variables-service.js'

const updatePersonalAddressChangeService = async (yar, credentials) => {
  const personalDetails = await fetchPersonalChangeService(yar, credentials, 'changePersonalAddress')

  if (!personalDetails.changePersonalAddress) {
    return
  }

  const variables = personalAddressVariables(personalDetails)

  await updateDalService(updatePersonalAddressMutation, variables, credentials.sessionId)

  yar.clear('personalDetailsUpdate')

  flashNotification(yar, 'Success', 'You have updated your personal address')
}

/**
 * Prepares the address details needed to update a personal address.
 *
 * The DAL/v1 supports two address submission modes:
 *
 * 1. Postcode lookup address (with UPRN)
 *    If a `uprn` (Unique Property Reference Number) is present, it is the
 *    primary identifier for the address. Other address fields are still
 *    included but are not strictly validated by the DAL.
 *
 * 2. Manually entered address (without UPRN)
 *    If there is no `uprn`, the DAL/v1 requires the following fields:
 *    - `line1`
 *    - `city`
 *    - `postalCode`
 *    - `country`
 *
 * For manual addresses, the address lines are mapped from the user input
 * into the DAL structure, with `county` stored in `line4`. The `city`
 * remains in the `city` field and `line5` is unused.
 *
 * Optional fields are normalized so that any `undefined` values are
 * converted to `null` before being sent to the DAL.
 *
 * @param {Object} personalDetails - The personal details object containing the address change
 * @returns {Object} Variables object formatted for the DAL mutation
 * @private
 */
const personalAddressVariables = (personalDetails) => {
  const change = personalDetails.changePersonalAddress

  // Base structure for the GraphQL mutation: includes the CRN (required for the mutation)
  // and sets up an empty address object that will be populated by the builder functions
  const baseVariables = {
    input: {
      crn: personalDetails.crn,
      address: {}
    }
  }

  baseVariables.input.address = change.uprn
    ? buildUprnAddress(change)
    : buildManualAddress(change)

  return baseVariables
}

export {
  updatePersonalAddressChangeService
}

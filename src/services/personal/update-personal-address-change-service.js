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
 * Normalizes a value to null if it is undefined.
 * @param {*} value - The value to normalize
 * @returns {*|null} The value if defined, otherwise null
 * @private
 */
const nullIfUndefined = (value) => {
  return value ?? null
}

/**
 * Builds address variables for an address chosen via postcode lookup (with UPRN).
 * When a UPRN is present, it is the only required field. The rest of the address
 * data is included but the DAL/v1 does not apply further validation.
 *
 * Optional fields are normalized using nullIfUndefined to ensure they are
 * explicitly set to `null` rather than being left `undefined`.
 *
 * @param {Object} change - The address change object containing UPRN and address fields
 * @returns {Object} Address object formatted for DAL/v1 with UPRN
 * @private
 */
const buildUprnAddress = (change) => {
  return {
    pafOrganisationName: nullIfUndefined(change.pafOrganisationName),
    buildingNumberRange: nullIfUndefined(change.buildingNumberRange),
    buildingName: nullIfUndefined(change.buildingName),
    flatName: nullIfUndefined(change.flatName),
    street: nullIfUndefined(change.street),
    city: nullIfUndefined(change.city),
    county: nullIfUndefined(change.county),
    postalCode: nullIfUndefined(change.postcode),
    country: nullIfUndefined(change.country),
    dependentLocality: nullIfUndefined(change.dependentLocality),
    doubleDependentLocality: nullIfUndefined(change.doubleDependentLocality),
    line1: null,
    line2: null,
    line3: null,
    line4: null,
    line5: null,
    uprn: change.uprn // required for DAL/v1
  }
}

/**
 * Builds address variables for a manually entered address (without UPRN).
 *
 * When there is no UPRN, the DAL/v1 applies stricter validation and requires
 * the following fields:
 * - `line1`
 * - `city`
 * - `postalCode`
 * - `country`
 *
 * The manually entered address fields are mapped into the DAL structure as follows:
 *
 * | User input field | DAL field |
 * |------------------|-----------|
 * | address1         | line1     |
 * | address2         | line2     |
 * | address3         | line3     |
 * | county           | line4     |
 * | city             | city      |
 *
 * `line5` is not used for manual addresses and is explicitly set to `null`.
 *
 * Optional fields are normalized using `nullIfUndefined` so that `undefined`
 * values are converted to `null`, ensuring consistent data sent to the DAL.
 *
 * @param {Object} change - The address change object containing manually entered address fields
 * @returns {Object} Address object formatted for DAL/v1 without UPRN
 * @private
 */
const buildManualAddress = (change) => {
  return {
    pafOrganisationName: null,
    buildingNumberRange: null,
    buildingName: null,
    flatName: null,
    street: null,
    dependentLocality: null,
    doubleDependentLocality: null,
    county: null,
    uprn: null,
    line1: change.address1, // required for DAL/v1
    line2: nullIfUndefined(change.address2),
    line3: nullIfUndefined(change.address3),
    line4: nullIfUndefined(change.county), // manual city mapped for validation
    line5: null,
    city: change.city, // required for DAL/v1
    postalCode: change.postcode, // required for DAL/v1
    country: change.country // required for DAL/v1
  }
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

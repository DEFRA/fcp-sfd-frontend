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

const updateBusinessAddressChangeService = async (yar, credentials) => {
  const businessDetails = await fetchBusinessChangeService(yar, credentials, 'changeBusinessAddress')
  const variables = businessAddressVariables(businessDetails)

  await updateDalService(updateBusinessAddressMutation, variables, credentials.sessionId)

  yar.clear('businessDetailsUpdate')

  flashNotification(yar, 'Success', 'You have updated your business address')
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
 * When there is no UPRN, the DAL/v1 enforces validation and requires the following
 * fields to be present:
 * - `postcode`
 * - `line1`
 * - `city`
 * - `country`
 *
 * When a user enters the address manually, the `city` is always captured
 * but stored as `line5`. We explicitly map `line4` into the `city` field
 * so that the DAL's validation rules are satisfied.
 *
 * Optional fields are normalized using nullIfUndefined to ensure they are
 * explicitly set to `null` rather than being left `undefined`.
 *
 * @param {Object} change - The address change object containing manually entered address fields
 * @returns {Object} Address object formatted for DAL/v1 without UPRN
 * @private
 */
const buildManualAddress = (change) => {
  return {
    buildingNumberRange: null,
    buildingName: null,
    flatName: null,
    street: null,
    city: change.city, // required for DAL/v1
    county: nullIfUndefined(change.county),
    postalCode: change.postcode, // required for DAL/v1
    country: change.country, // required for DAL/v1
    line1: change.address1, // required for DAL/v1
    line2: nullIfUndefined(change.address2),
    line3: nullIfUndefined(change.address3),
    line4: nullIfUndefined(change.city), // manual city mapped for validation
    line5: nullIfUndefined(change.county),
    uprn: null
  }
}

/**
 * Prepares the address details needed to update a business address.
 * On the DAL/v1 there are two types of validation:
 *
 * 1. If the address comes from the postcode lookup, a `uprn`
 *    (Unique Property Reference Number) will be present. In this case,
 *    the only required field is the `uprn`. The rest of the address data
 *    is still included, but the DAL/v1 does not apply further validation.
 *
 * 2. If there is no `uprn`, it means the user entered the address manually.
 *    In this case, the DAL/v1 enforces validation and requires the following
 *    fields to be present:
 *    - `postcode`
 *    - `line1`
 *    - `city`
 *    - `country`
 *
 * When a user enters the address manually, the `city` is always captured
 * but stored as `line5`. We explicitly map `line4` into the `city` field
 * so that the DAL's validation rules are satisfied.
 *
 * Optional fields are normalized to ensure they are explicitly set to `null`
 * rather than being left `undefined`.
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

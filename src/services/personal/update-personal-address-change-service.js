/**
 * Service to update a personal address
 *
 * Fetches the pending personal address change from the session
 * Prepares the address variables, handling both postcode-lookup and manually entered addresses
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
  const variables = personalAddressVariables(personalDetails)

  await updateDalService(updatePersonalAddressMutation, variables)

  yar.clear('personalDetails')

  flashNotification(yar, 'Success', 'You have updated your personal address')
}

/**
 * Prepares the address details needed to update a personal address.
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
 * so that the DAL’s validation rules are satisfied.
 *
 * Any optional fields are written with the nullish coalescing operator. This ensures
 * that if the user does not provide a value, the field is explicitly set
 * to `null` rather than being left `undefined`.
 *
 * @private
 */
const personalAddressVariables = (personalDetails) => {
  const change = personalDetails.changePersonalAddress

  const variables = {
    input: {
      crn: personalDetails.crn,
      customer: {
        info: {
          address: {}
        }
      }
    }
  }

  if (change.uprn) {
    // Address chosen via postcode lookup
    variables.input.customer.info.address.withUprn = {
      buildingNumberRange: change.buildingNumberRange ?? null,
      buildingName: change.buildingName ?? null,
      flatName: change.flatName ?? null,
      street: change.street ?? null,
      city: change.city ?? null,
      county: change.county ?? null,
      postalCode: change.postcode ?? null,
      country: change.country ?? null,
      dependentLocality: change.dependentLocality ?? null,
      doubleDependentLocality: change.doubleDependentLocality ?? null,
      line1: null,
      line2: null,
      line3: null,
      line4: null,
      line5: null,
      uprn: change.uprn // required for DAL/v1
    }
  } else {
    // Address entered manually
    variables.input.customer.info.address.withoutUprn = {
      buildingNumberRange: null,
      buildingName: null,
      flatName: null,
      street: null,
      city: change.city, // required for DAL/v1
      county: change.county ?? null,
      postalCode: change.postcode, // required for DAL/v1
      country: change.country, // required for DAL/v1
      line1: change.address1, // required for DAL/v1
      line2: change.address2 ?? null,
      line3: change.address3 ?? null,
      line4: change.city ?? null, // manual city mapped for validation
      line5: change.county ?? null,
      uprn: null
    }
  }

  return variables
}

export {
  updatePersonalAddressChangeService
}

/**
 * Maps addresses returned by the OS Places API into a format suitable
 * for front-end display and DAL updating.
 * https://docs.os.uk/os-apis/accessing-os-apis/os-places-api/datasets as a reference for the datasets
 *
 * @module businessAddressLookupMapper
 */

import { COUNTRY_NAMES } from '../constants/country-names.js'
import { businessAddressLookupSchema } from '../schemas/business/business-address-lookup-schema.js'

const businessAddressLookupMapper = (addresses) => {
  return addresses.map((address) => {
    const { error } = businessAddressLookupSchema.validate(address)

    if (error) {
      return null
    }

    const {
      UPRN,
      ADDRESS,
      ORGANISATION_NAME,
      DEPARTMENT_NAME,
      SUB_BUILDING_NAME,
      BUILDING_NAME,
      BUILDING_NUMBER,
      DEPENDENT_THOROUGHFARE_NAME,
      THOROUGHFARE_NAME,
      DOUBLE_DEPENDENT_LOCALITY,
      DEPENDENT_LOCALITY,
      POST_TOWN,
      POSTCODE,
      LOCAL_CUSTODIAN_CODE_DESCRIPTION,
      COUNTRY_CODE
    } = address.properties

    const buildingName = filterAndJoin([ORGANISATION_NAME, DEPARTMENT_NAME, BUILDING_NAME])
    const street = filterAndJoin([DEPENDENT_THOROUGHFARE_NAME, THOROUGHFARE_NAME])

    // Set county to null if it's just a placeholder or the same as the post town
    const county =
      LOCAL_CUSTODIAN_CODE_DESCRIPTION === 'ORDNANCE SURVEY' || LOCAL_CUSTODIAN_CODE_DESCRIPTION === POST_TOWN
        ? null
        : LOCAL_CUSTODIAN_CODE_DESCRIPTION

    return {
      displayAddress: ADDRESS,
      flatName: SUB_BUILDING_NAME ?? null,
      buildingName,
      buildingNumberRange: BUILDING_NUMBER ?? null,
      street,
      dependentLocality: DEPENDENT_LOCALITY ?? null,
      doubleDependentLocality: DOUBLE_DEPENDENT_LOCALITY ?? null,
      city: POST_TOWN,
      county,
      postcode: POSTCODE,
      country: COUNTRY_NAMES[COUNTRY_CODE] ?? null,
      uprn: UPRN
    }
  }).filter(Boolean) // remove null values
}

const filterAndJoin = (addressesProperties) => {
  return addressesProperties.filter(Boolean).join(', ') || null
}

export {
  businessAddressLookupMapper
}

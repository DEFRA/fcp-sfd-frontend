/**
 * Maps addresses returned by the OS Places API into a format suitable
 * for front-end display and DAL updating.
 * https://docs.os.uk/os-apis/accessing-os-apis/os-places-api/datasets as a reference for the datasets
 *
 * @module businessAddressLookupMapper
 */

import { COUNTRY_NAMES } from '../constants/country-names.js'

const businessAddressLookupMapper = (addresses) => {
  return addresses.map((address) => {
    const {
      UPRN, // always present
      ADDRESS, // always present
      ORGANISATION_NAME, // optional
      DEPARTMENT_NAME, // optional
      SUB_BUILDING_NAME, // optional
      BUILDING_NAME, // optional
      BUILDING_NUMBER, // optional
      DEPENDENT_THOROUGHFARE_NAME, // optional
      THOROUGHFARE_NAME, // optional
      DOUBLE_DEPENDENT_LOCALITY, // optional
      DEPENDENT_LOCALITY, // optional
      POST_TOWN, // always present
      POSTCODE, // always present
      LOCAL_CUSTODIAN_CODE_DESCRIPTION, // always present
      COUNTRY_CODE // always present
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
      buildingName,
      flatName: SUB_BUILDING_NAME ?? null,
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
  })
}

const filterAndJoin = (addressesProperties) => {
  return addressesProperties.filter(Boolean).join(', ') || null
}

export {
  businessAddressLookupMapper
}

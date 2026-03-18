/**
 * Maps addresses returned by the OS Places API into a format suitable
 * for front-end display and DAL updating.
 * https://docs.os.uk/os-apis/accessing-os-apis/os-places-api/datasets as a reference for the datasets
 *
 * @module addressLookupMapper
 */

import { COUNTRY_NAMES } from '../constants/country-names.js'
import { addressLookupSchema } from '../schemas/os-places/address-lookup-schema.js'

const addressLookupMapper = (addresses) => {
  return addresses.map((address) => {
    const { error } = addressLookupSchema.validate(address)

    if (error) {
      return null
    }

    const {
      UPRN,
      ADDRESS,
      PO_BOX_NUMBER,
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

    const buildingName = PO_BOX_NUMBER ? `PO BOX ${PO_BOX_NUMBER}` : BUILDING_NAME || null

    return {
      displayAddress: ADDRESS,
      pafOrganisationName: filterAndJoin([ORGANISATION_NAME, DEPARTMENT_NAME]),
      flatName: SUB_BUILDING_NAME ?? null,
      buildingName,
      buildingNumberRange: BUILDING_NUMBER ?? null,
      street: filterAndJoin([DEPENDENT_THOROUGHFARE_NAME, THOROUGHFARE_NAME]),
      dependentLocality: DEPENDENT_LOCALITY ?? null,
      doubleDependentLocality: DOUBLE_DEPENDENT_LOCALITY ?? null,
      city: POST_TOWN,
      county: formatCounty(LOCAL_CUSTODIAN_CODE_DESCRIPTION, POST_TOWN),
      postcode: POSTCODE,
      country: COUNTRY_NAMES[COUNTRY_CODE] ?? null,
      uprn: UPRN
    }
  }).filter(Boolean)
}

// Remove placeholder county values
const formatCounty = (localCustodianCodeDescription, postTown) => {
  if (localCustodianCodeDescription === 'ORDNANCE SURVEY' || localCustodianCodeDescription === postTown) {
    return null
  }

  return localCustodianCodeDescription
}

const filterAndJoin = (addressesProperties) => {
  return addressesProperties.filter(Boolean).join(', ') || null
}

export {
  addressLookupMapper
}

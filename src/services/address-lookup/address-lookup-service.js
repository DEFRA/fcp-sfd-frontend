import { placesAPI } from 'osdatahub'
import { config } from '../../config/index.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger()

const addressLookupService = async (postcode, yar) => {
  const { features: addresses } = await fetchAddressesFromPostcodeLookup(postcode)

  if (addresses.length === 0) {
    return []
  }

  const mappedAddresses = mapAddresses(addresses)
  console.log('🚀 ~ mappedAddresses:', mappedAddresses)

  setSessionData(yar, 'businessDetails', 'changeBusinessAddresses', mappedAddresses)

  return mappedAddresses
}

const fetchAddressesFromPostcodeLookup = async (postcode) => {
  try {
    const { clientId } = config.get('osPlacesConfig')

    return await placesAPI.postcode(clientId, postcode, { limit: 150 })
  } catch (error) {
    logger.error(err, 'Error connecting to Postcode lookup API')

    return {
      data: null,
      statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      errors: [err]
    }
  }
}

/**
 * https://docs.os.uk/os-apis/accessing-os-apis/os-places-api/datasets
 * @param {*} addresses
 * @returns
 */
const mapAddresses = (addresses) => {
  const mappedAddresses = []

  for (const address of addresses) {
    console.log('🚀 ~ address.properties:', address.properties)
    const {
      UPRN, // 1
      ADDRESS, // 1
      ORGANISATION_NAME, // 0..1
      DEPARTMENT_NAME, // 0..1
      SUB_BUILDING_NAME, // 0..1
      BUILDING_NAME, // 0..1
      BUILDING_NUMBER, // 0..1
      DEPENDENT_THOROUGHFARE_NAME, // 0..1
      THOROUGHFARE_NAME, // 0..1
      DOUBLE_DEPENDENT_LOCALITY, // 0..1
      DEPENDENT_LOCALITY, // 0..1
      POST_TOWN, // 1
      POSTCODE, // 1
      LOCAL_CUSTODIAN_CODE_DESCRIPTION, // 1
      COUNTRY_CODE // 1
    } = address.properties

    // const mappedAddress = {
    //   displayAddress: ADDRESS,
    //   buildingNumberRange: BUILDING_NUMBER,
    //   buildingName: SUB_BUILDING_NAME,
    //   uprn: UPRN,
    //   street: THOROUGHFARE_NAME,
    //   city: POST_TOWN,
    //   postcode: POSTCODE,
    //   localCustodian: LOCAL_CUSTODIAN_CODE_DESCRIPTION,
    //   country: countryCode(COUNTRY_CODE)
    // }

    const buildingName = [ORGANISATION_NAME, DEPARTMENT_NAME, BUILDING_NAME]
      .filter(Boolean)
      .join(', ') || null

    const street = [DEPENDENT_THOROUGHFARE_NAME, THOROUGHFARE_NAME]
      .filter(Boolean)
      .join(', ') || null

    const mappedAddress = {
      //Building number
      displayAddress: ADDRESS,
      buildingName,
      flatName: SUB_BUILDING_NAME ?? null,
      buildingNumberRange: BUILDING_NUMBER ?? null,
      street,
      dependentLocality: DEPENDENT_LOCALITY ?? null,
      doubleDependentLocality: DOUBLE_DEPENDENT_LOCALITY ?? null,
      city: POST_TOWN,
      county: LOCAL_CUSTODIAN_CODE_DESCRIPTION === 'ORDNANCE SURVEY' || LOCAL_CUSTODIAN_CODE_DESCRIPTION === POST_TOWN ? null : LOCAL_CUSTODIAN_CODE_DESCRIPTION,
      postcode: POSTCODE,
      country: countryCode(COUNTRY_CODE),
      uprn: UPRN
    }

    mappedAddresses.push(mappedAddress)
  }

  return mappedAddresses
}

const countryCode = (countryCode) => {
  if (countryCode === 'E') {
    return 'England'
  } else if (countryCode === 'W') {
    return 'Wales'
  } else if (countryCode === 'S') {
    return 'Scotland'
  } else if (countryCode === 'N') {
    return 'Northern Ireland'
  } else if (countryCode === 'L') {
    return 'Channel Islands'
  } else if (countryCode === 'M') {
    return 'Isle of Man'
  }
}

export {
  addressLookupService
}

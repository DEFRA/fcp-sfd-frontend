/**
 * Service to fetch, map and store addresses from the OS Places API based on a UK postcode.
 *
 *  The service:
 * - Calls the OS Places API via the official `osdatahub` package to search for addresses for a given postcode
 * - Maps the returned address properties into a format suitable for front-end display and for updating via the DAL.
 * - Stores the mapped addresses in the user's session for later retrieval
 *
 * @module businessAddressLookupService
 */

import { config } from '../../config/index.js'
import { createLogger } from '../../utils/logger.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { placesAPI } from 'osdatahub'
import { constants as httpConstants } from 'node:http2'
import { addressLookupMapper } from '../../mappers/address-lookup-mapper.js'

const logger = createLogger()

const businessAddressLookupService = async (postcode, yar) => {
  const addresses = await fetchAddressesFromPostcodeLookup(postcode)

  if (addresses.errors) {
    return addresses
  }

  if (!addresses?.length) {
    // Create a Joi-like error object to indicate that the postcode lookup returned no addresses
    return {
      error: [
        {
          message: 'No addresses found for this postcode',
          path: ['businessPostcode']
        }
      ]
    }
  }

  const mappedAddresses = addressLookupMapper(addresses)
  setSessionData(yar, 'businessDetails', 'changeBusinessAddresses', mappedAddresses)

  return mappedAddresses
}

const fetchAddressesFromPostcodeLookup = async (postcode) => {
  try {
    const { clientId } = config.get('osPlacesConfig')

    const response = await placesAPI.postcode(clientId, postcode, { limit: 150 })

    return response.features ?? []
  } catch (error) {
    logger.error(error, 'Error connecting to Postcode lookup API')

    return {
      statusCode: httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
      errors: [error]
    }
  }
}

export {
  businessAddressLookupService
}

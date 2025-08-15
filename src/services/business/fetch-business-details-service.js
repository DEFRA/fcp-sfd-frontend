/**
 * Returns the `businessDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchBusinessDetailsService
 */

import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery } from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'
import { config } from '../../config/index.js'
import { mappedData } from '../../mock-data/mock-business-details.js'
import { getTokenService } from '../DAL/get-token-service.js'

const fetchBusinessDetailsService = async (yar) => {
  // TO DO: If the environment is a development environment then return the business details from the mock data or
  // the dal dev environment (depending on the feature toggle).

  // If its a test or prod environment then  check if a token already exists and if it does has it expired yet
  // If thats all fine then query the dal for the business details with the existing token
  // If its not fine then hit the get token service to get a new token and query the dal for the business details

  // TO DO: The token hasn't yet been stored on the server side. Add the token to the server side storage and query that

  // New getTokenService to be used when the token doesn't exist or it has expired.
  const accessToken = await getTokenService()

  const businessDetails = yar.get('businessDetails')
  if (businessDetails) {
    return businessDetails
  }

  const businessDetailsData = config.get('featureToggle.dalConnection') ? await getFromDal() : mappedData

  yar.set('businessDetails', businessDetailsData)

  return businessDetailsData
}

const getFromDal = async () => {
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'test.user11@defra.gov.uk'

  const dalResponse = await dalConnector(businessDetailsQuery, variables, email)

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchBusinessDetailsService
}

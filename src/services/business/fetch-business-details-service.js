/**
 * Returns the `businessDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * Note: In some environments the DAL connection is disabled while we wait for the DAL team to set it up, specifically
 * test and pre
 *
 * @module fetchBusinessDetailsService
 */

import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery } from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'
import { mappedData } from '../../../test/mocks/mock-business-details.js'
import { featureFlagsConfig } from '../../config/feature-flags.js'

const fetchBusinessDetailsService = async (yar) => {
  const businessDetails = yar.get('businessDetails')
  // If business details already exists on the session then return it
  if (businessDetails) {
    return businessDetails
  }

  // If the DAL connection is set to false return mock data otherwise query the DAL
  const businessDetailsData = !featureFlagsConfig.dalConnection ? mappedData : await getFromDal(yar)

  // Set the business details data on the session
  yar.set('businessDetails', businessDetailsData)

  return businessDetailsData
}

const getFromDal = async () => {
  // Replace variables and email when defraId is setup
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'not-a-real-email@test.co.uk'

  const dalResponse = await dalConnector(businessDetailsQuery, variables, email)

  if (!dalResponse.data) {
    return dalResponse
  }

  return mapBusinessDetails(dalResponse.data)
}

export {
  fetchBusinessDetailsService
}

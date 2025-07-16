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
import { dalData } from '../../../test/mocks/mock-business-details.js'
import { config } from '../../config/index.js'

const fetchBusinessDetailsService = async (yar) => {
  const businessDetails = yar.get('businessDetails')
  // If business details already exists on the session then return it
  if (businessDetails) {
    return businessDetails
  }

  // If the DAL connection is not set then return the mock data
  if (!config.get('server.dalConnection')) {
    const mappedResponse = mapBusinessDetails(dalData)
    yar.set('businessDetails', mappedResponse)

    return mappedResponse
  }

  // Return the response from the DAL
  return getFromDal(yar)
}

const getFromDal = async (yar) => {
  // replace variables and email when defraId is setup
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'not-a-real-email@test.co.uk'

  const dalResponse = await dalConnector(businessDetailsQuery, variables, email)

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)
    yar.set('businessDetails', mappedResponse)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchBusinessDetailsService
}

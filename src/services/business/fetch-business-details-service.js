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
import { getTokenService } from '../DAL/token/get-token-service1.js'
import { isDevelopment } from '../../constants/environments.js'

const fetchBusinessDetailsService = async (yar, cache) => {
  const accessToken = await getTokenService(cache)
  console.log('🚀 ~ accessToken:', accessToken)
}

const testEnvironmentData = async (yar) => {
  const businessDetails = yar.get('businessDetails')

  if (businessDetails) {
    return businessDetails
  }

  const businessDetailsData = config.get('featureToggle.dalConnection') ? await getFromDal() : mappedData

  yar.set('businessDetails', businessDetailsData)
}

const getFromDal = async () => {
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'test.user11@defra.gov.uk'

  const dalResponse = await dalConnector(businessDetailsQuery, variables, email, token)

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchBusinessDetailsService
}

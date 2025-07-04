import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery } from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'

/**
 * Returns the businessDetails from the session cache if defined
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 * @module fetchBusinessDetailsService
 */

const fetchBusinessDetailsService = async (yar) => {
  return yar.get('businessDetails') ?? await getFromDal(yar)
}

const getFromDal = async (yar) => {
  // replace variables and email when defraid is setup
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

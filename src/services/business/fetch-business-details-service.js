import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery } from '../../dal/queries/business-details.js'
/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessDetailsService
 */

const fetchBusinessDetailsService = async (yar) => {
  const businessDetails = yar.get('businessDetails') ?? await getFromDal(yar)
  // map and validate the data
  return businessDetails
}

const getFromDal = async (yar) => {
  // replace variables and email when defraid is setup
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'not-a-real-email@test.co.uk'

  const dalResponse = await dalConnector(businessDetailsQuery, variables, email)
  if (dalResponse.data) {
    yar.set('businessDetails', dalResponse.data)
    return dalResponse.data
  }
  return dalResponse
}

export {
  fetchBusinessDetailsService
}

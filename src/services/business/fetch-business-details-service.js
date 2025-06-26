import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery } from '../../dal/queries/business-details.js'
/**
 * Fetches the business details associated with the logged in users business
 * @module fetchBusinessDetailsService
 */

const fetchBusinessDetailsService = async (yar) => {
  const sessionData = yar.get('businessDetailsData')

  // If sessionData is null it means it has never been set and therefore this is the first time the user
  // has hit the page. In this case return the mock data (this will be replaced with an API call)

  // If the sessionData.businessDetailsUpdated is true then it means the user has updated the data on the change pages
  // and therefore we need to return the mock data (this will be replaced with an API call)
  if (sessionData === null || sessionData.businessDetailsUpdated === true) {
    // replace variables and email when defraid is setup
    const variables = { sbi: '107183280', crn: '9477368292' }
    const email = 'not-a-real-email@test.co.uk'
    const dalResponse = await dalConnector(businessDetailsQuery, variables, email)
    return !dalResponse.errors ? dalResponse.data : dalResponse
    // what should this module return when the dalConnector throws an error
    // probably handle it all here and then throw
  }

  // Otherwise the data has not been updated so return the session data
  return sessionData
}

export {
  fetchBusinessDetailsService
}

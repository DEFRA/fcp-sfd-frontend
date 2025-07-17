/**
 * Returns the `personalDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchPersonalDetailsService
 */

import { dalConnector } from '../../dal/connector.js'
import { personalDetailsQuery } from '../../dal/queries/personal-details.js'
import { mapPersonalDetails } from '../../mappers/personal-details-mapper.js'

const fetchPersonalDetailsService = async (yar) => {
  return yar.get('personalDetails') ?? getFromDal(yar)
}

const getFromDal = async (yar) => {
  // replace variables and email when defraId is setup
  const variables = { sbi: '107183280', crn: '9477368292' }
  const email = 'not-a-real-email@test.co.uk'

  const dalResponse = await dalConnector(personalDetailsQuery, variables, email)

  if (dalResponse.data) {
    const mappedResponse = mapPersonalDetails(dalResponse.data)
    yar.set('personalDetails', mappedResponse)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchPersonalDetailsService
}

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
import { config } from '../../config/index.js'
import { mappedData } from '../../mock-data/mock-personal-details.js'

const fetchPersonalDetailsService = async (yar) => {
  const personalDetails = yar.get('personalDetails')

  if (personalDetails) {
    return personalDetails
  }

  const personalDetailsData = config.get('featureToggle.dalConnection') ? await getFromDal(yar) : mappedData

  yar.set('personalDetails', personalDetailsData)

  return personalDetailsData
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

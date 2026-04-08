/**
 * Returns the `personalDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchPersonalDetailsService
 */

import { getDalConnector } from '../../dal/connector.js'
import { personalDetailsQuery } from '../../dal/queries/personal-details.js'
import { mapPersonalDetails } from '../../mappers/personal-details-mapper.js'

const fetchPersonalDetailsService = async (credentials) => {
  const { crn, sbi, sessionId } = credentials

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.query(
    personalDetailsQuery,
    { crn, sbi },
    { sessionId }
  )

  if (dalResponse.data) {
    const mappedResponse = mapPersonalDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchPersonalDetailsService
}

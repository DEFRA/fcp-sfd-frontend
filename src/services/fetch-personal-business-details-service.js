/**
 * Returns personal and business details from the DAL
 *
 * @module fetchPersonalBusinessDetailsService
 */

import { getDalConnector } from '../dal/connector.js'
import { personalBusinessDetailsQuery } from '../dal/queries/personal-business-details.js'
import { mapPersonalBusinessDetails } from '../mappers/personal-business-details-mapper.js'

const fetchPersonalBusinessDetailsService = async (credentials) => {
  const { crn, sbi, sessionId } = credentials

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.executeDalQuery(
    personalBusinessDetailsQuery,
    { crn, sbi },
    sessionId
  )

  if (dalResponse.data) {
    const mappedResponse = mapPersonalBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchPersonalBusinessDetailsService
}

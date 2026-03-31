/**
 * Returns personal and business details from the DAL
 *
 * @module fetchPersonalBusinessDetailsService
 */

import { dalConnector } from '../dal/connector.js'
import { personalBusinessDetailsQuery } from '../dal/queries/personal-business-details.js'
import { mapPersonalBusinessDetails } from '../mappers/personal-business-details-mapper.js'

const fetchPersonalBusinessDetailsService = async (credentials) => {
  const { crn, sbi, sessionId } = credentials

  const dalResponse = await dalConnector(personalBusinessDetailsQuery, { crn, sbi }, sessionId)

  if (dalResponse.data) {
    const mappedResponse = mapPersonalBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchPersonalBusinessDetailsService
}

/**
 * Returns personal and business details from the DAL
 *
 * @module fetchPersonalBusinessDetailsService
 */

import { getDalConnector } from '../dal/connector.js'
import { personalBusinessDetailsQuery } from '../dal/queries/personal-business-details.js'
import { mappers } from '@defra/fcp-sfd-frontend-engine'

const fetchPersonalBusinessDetailsService = async (credentials) => {
  const { crn, sbi, sessionId } = credentials

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.query(
    personalBusinessDetailsQuery,
    { crn, sbi },
    { sessionId }
  )

  if (dalResponse.data) {
    const mappedResponse = mappers.mapPersonalBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  throw new Error('Failed to retrieve personal and business details')
}

export {
  fetchPersonalBusinessDetailsService
}

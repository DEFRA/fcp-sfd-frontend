/**
 * Returns the `personalDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchPersonalDetailsService
 */

import { mappers } from '@defra/fcp-sfd-frontend-engine'

import { getDalConnector } from '../../dal/connector.js'
import { personalDetailsQuery } from '../../dal/queries/personal-details.js'

const fetchPersonalDetailsService = async (credentials) => {
  const { crn, sbi, sessionId } = credentials

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.query(
    personalDetailsQuery,
    { crn, sbi },
    { sessionId }
  )

  if (dalResponse.data) {
    const mappedResponse = mappers.personalDetails(dalResponse.data)

    // The external service also needs to fetch the business name, used for the back link
    mappedResponse.business = {
      info: {
        name: dalResponse.data.business?.info?.name ?? null
      }
    }

    return mappedResponse
  }

  throw new Error('Failed to retrieve personal details')
}

export {
  fetchPersonalDetailsService
}

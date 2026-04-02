/**
 * Returns the `businessDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchBusinessDetailsService
 */

import { getDalConnector } from '../../dal/connector.js'
import { businessDetailsQuery, businessDetailsQueryWithoutCph } from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'
import { config } from '../../config/index.js'

const fetchBusinessDetailsService = async (credentials) => {
  const { sbi, crn, sessionId } = credentials
  const cphEnabled = config.get('featureToggle.cphEnabled')
  const query = cphEnabled ? businessDetailsQuery : businessDetailsQueryWithoutCph

  const dalConnector = getDalConnector()
  const dalResponse = await dalConnector.query(query, { sbi, crn }, sessionId)

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchBusinessDetailsService
}

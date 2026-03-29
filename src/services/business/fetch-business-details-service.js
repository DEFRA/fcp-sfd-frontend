/**
 * Returns the `businessDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchBusinessDetailsService
 */

import { dalConnector } from '../../dal/connector.js'
import { businessDetailsQuery, businessDetailsQueryWithoutCph } from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'
import { config } from '../../config/index.js'

const fetchBusinessDetailsService = async (credentials, options = {}) => {
  const { sbi, crn, sessionId } = credentials
  // Use the caller's value if they passed it (e.g. in tests); otherwise use app config.
  const cphEnabled = options.cphEnabled ?? config.get('featureToggle.cphEnabled')
  const query = cphEnabled ? businessDetailsQuery : businessDetailsQueryWithoutCph

  const dalResponse = await dalConnector(query, { sbi, crn }, sessionId)

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchBusinessDetailsService
}

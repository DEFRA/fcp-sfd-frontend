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
import { mappedData, mappedDataWithoutCph } from '../../mock-data/mock-business-details.js'

const fetchBusinessDetailsService = async (credentials) => {
  const cphEnabled = config.get('featureToggle.cphEnabled')
  const dalConnectionEnabled = config.get('featureToggle.dalConnection')

  if (!dalConnectionEnabled) {
    return cphEnabled
      ? mappedData
      : mappedDataWithoutCph
  }

  return getFromDal(credentials, cphEnabled)
}

const getFromDal = async (credentials, isCPHEnabled) => {
  const { sbi, crn } = credentials
  const query = isCPHEnabled ? businessDetailsQuery : businessDetailsQueryWithoutCph

  const dalResponse = await dalConnector(query, { sbi, crn })

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

export {
  fetchBusinessDetailsService
}

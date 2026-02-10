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
import { createLogger } from '../../utils/logger.js'

const logger = createLogger()

const fetchBusinessDetailsService = async (credentials) => {
  const cphEnabled = config.get('featureToggle.cphEnabled')
  const dalConnectionEnabled = config.get('featureToggle.dalConnection')

  logger.info({ cphEnabled, dalConnectionEnabled }, 'Fetching business details')

  if (!dalConnectionEnabled) {
    logger.info('DAL connection disabled, returning mock data')
    return cphEnabled
      ? mappedData
      : mappedDataWithoutCph
  }

  return getFromDal(credentials, cphEnabled)
}

const getFromDal = async (credentials, isCPHEnabled) => {
  const { sbi, crn } = credentials
  const query = isCPHEnabled ? businessDetailsQuery : businessDetailsQueryWithoutCph

  logger.info({ sbi, crn, isCPHEnabled }, 'Querying DAL for business details')
  let dalResponse
  try {
    dalResponse = await dalConnector(query, { sbi, crn })
  } catch (error) {
    logger.error(error, 'Failed to query DAL for business details')
    throw error
  }

  if (dalResponse.errors) {
    logger.error({ errors: dalResponse.errors }, 'DAL returned errors for business details query')
  }

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)
    logger.info('Business details fetched and mapped successfully')

    return mappedResponse
  }

  logger.warn({ dalResponse }, 'DAL response has no data for business details, returning raw response')
  return dalResponse
}

export {
  fetchBusinessDetailsService
}

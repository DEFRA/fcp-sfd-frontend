/**
 * Returns the `businessDetails` from the session cache if defined,
 * otherwise queries the DAL, maps the response, updates the cache
 * and returns the mapped payload
 *
 * @module fetchBusinessDetailsService
 */

import { dalConnector } from '../../dal/connector.js'
import {
  businessDetailsQuery,
  businessDetailsQueryWithoutCph
} from '../../dal/queries/business-details.js'
import { mapBusinessDetails } from '../../mappers/business-details-mapper.js'
import { config } from '../../config/index.js'
import { mappedData } from '../../mock-data/mock-business-details.js'

const fetchBusinessDetailsService = async (credentials) => {
  if (!config.get('featureToggle.dalConnection')) {
    return mappedData
  }

  return getFromDal(credentials)
}

const getFromDal = async (credentials) => {
  const { sbi, crn } = credentials
  const query = getBusinessDetailsQuery()

  const dalResponse = await dalConnector(query, { sbi, crn })

  if (dalResponse.data) {
    const mappedResponse = mapBusinessDetails(dalResponse.data)

    return mappedResponse
  }

  return dalResponse
}

const getBusinessDetailsQuery = () => {
  if (config.get('featureToggle.cphEnabled')) {
    return businessDetailsQuery
  }

  return businessDetailsQueryWithoutCph
}

export {
  fetchBusinessDetailsService
}

/**
 * Returns personal and business details from the DAL
 *
 * @module fetchPersonalBusinessDetailsService
 */

import { dalConnector } from '../dal/connector.js'
import { personalBusinessDetailsQuery } from '../dal/queries/personal-business-details.js'
import { mapPersonalBusinessDetails } from '../mappers/personal-business-details-mapper.js'
import { config } from '../config/index.js'
import { mappedData } from '../mock-data/mock-personal-business-details.js'

const fetchPersonalBusinessDetailsService = async (credentials) => {
  if (!config.get('featureToggle.dalConnection')) {
    return mappedData
  }

  return getFromDal(credentials)
}

const getFromDal = async (credentials) => {
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

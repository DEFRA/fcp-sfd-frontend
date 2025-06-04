/**
 * Orchestrates fetching and presenting the data needed for the `/business-details` page
 * @module businessDetailsService
 */

import { businessDetailsPresenter } from '../../presenters/business/business-details.presenter.js'
import { fetchBusinessDetailsService } from './fetch-business-details.service.js'

/**
 * Orchestrates fetching and presenting the data needed for the `/business-details` page
 *
 * @param {object} request - the hapi request object
 *
 * @returns {Promise<object>} The view data for the `/business-details` page
 */
const businessDetailsService = async (request) => {
  const data = await fetchBusinessDetailsService(request)

  const pageData = businessDetailsPresenter(data, request.yar)

  return {
    ...pageData
  }
}

export {
  businessDetailsService
}

/**
 * Orchestrates fetching and presenting the data needed for the `/business-details` page
 * @module businessDetailsService
 */

import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'
import { fetchBusinessDetailsService } from './fetch-business-details-service.js'

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

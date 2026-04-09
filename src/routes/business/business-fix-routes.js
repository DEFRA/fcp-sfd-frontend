import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessFixPresenter } from '../../presenters/business/business-fix-presenter.js'
import { initialiseFixJourneyService } from '../../services/initialise-fix-journey-service.js'

const getBusinessFix = {
  method: 'GET',
  path: '/business-fix',
  handler: async (request, h) => {
    const { yar, query, auth } = request

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    const sessionData = initialiseFixJourneyService(yar, query.source, 'business')
    const pageData = businessFixPresenter(sessionData, businessDetails)

    return h.view('business/business-fix.njk', pageData)
  }
}

const postBusinessFix = {
  method: 'POST',
  path: '/business-fix',
  handler: async (_request, h) => {
    return h.redirect('/business-fix-list')
  }
}

export const businessFixRoutes = [
  getBusinessFix,
  postBusinessFix
]

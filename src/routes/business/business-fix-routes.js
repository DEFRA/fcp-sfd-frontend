import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessFixPresenter } from '../../presenters/business/business-fix-presenter.js'
import { initialiseFixJourneyService } from '../../services/initialise-fix-journey-service.js'
import { checkInterruptedJourneyPreHandler } from '../check-interrupter-journey-pre-handler-route.js'

const BUSINESS_DETAILS_ROUTE = '/business-details'

const getBusinessFix = {
  method: 'GET',
  path: '/business-fix',
  options: {
    pre: [checkInterruptedJourneyPreHandler('businessDetailsValidation', BUSINESS_DETAILS_ROUTE)]
  },
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

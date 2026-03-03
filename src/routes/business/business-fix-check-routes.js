import { fetchBusinessFixService } from '../../services/business/fetch-business-fix-service.js'
import { businessFixCheckPresenter } from '../../presenters/business/business-fix-check-presenter.js'
import { updateBusinessFixService } from '../../services/business/update-business-fix-service.js'
import { checkInterruptedJourneyPreHandler } from '../check-interrupter-journey-pre-handler-route.js'

const BUSINESS_DETAILS_ROUTE = '/business-details'

const getBusinessFixCheck = {
  method: 'GET',
  path: '/business-fix-check',
  options: {
    pre: [checkInterruptedJourneyPreHandler('businessDetailsValidation', BUSINESS_DETAILS_ROUTE)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('businessDetailsValidation')
    const businessDetails = await fetchBusinessFixService(auth.credentials, sessionData)
    const pageData = businessFixCheckPresenter(businessDetails)

    return h.view('business/business-fix-check.njk', pageData)
  }
}

const postBusinessFixCheck = {
  method: 'POST',
  path: '/business-fix-check',
  options: {
    pre: [checkInterruptedJourneyPreHandler('businessDetailsValidation', BUSINESS_DETAILS_ROUTE)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('businessDetailsValidation')
    await updateBusinessFixService(sessionData, yar, auth.credentials)

    return h.redirect(BUSINESS_DETAILS_ROUTE)
  }
}

export const businessFixCheckRoutes = [
  getBusinessFixCheck,
  postBusinessFixCheck
]

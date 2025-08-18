import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'

const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  options: {
    auth: { scope: ['BUSINESS_DETAILS:FULL_PERMISSION'] }
  },
  handler: async (request, h) => {
    const { yar, auth, server } = request
    const businessDetails = await fetchBusinessDetailsService(yar, auth.credentials, server.app.tokenCache)
    const pageData = businessDetailsPresenter(businessDetails, yar)

    return h.view('business/business-details.njk', pageData)
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails
]

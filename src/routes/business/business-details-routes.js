import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'

const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.yar)
    const pageData = businessDetailsPresenter(businessDetails, request.yar)

    return h.view('business/business-details.njk', pageData)
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails
]

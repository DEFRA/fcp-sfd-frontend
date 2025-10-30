import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    yar.clear('businessDetails')

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    const pageData = businessDetailsPresenter(businessDetails, yar, request.auth.credentials.scope)

    return h.view('business/business-details.njk', pageData)
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails
]

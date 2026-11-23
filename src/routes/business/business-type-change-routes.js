import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessTypeChangePresenter } from '../../presenters/business/business-type-change-presenter.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'

// No pre-handlers required for this route as its only purpose is to display the business type information page
const getBusinessTypeChange = {
  method: 'GET',
  path: '/business-type-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { auth } = request

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    const pageData = businessTypeChangePresenter(businessDetails)

    return h.view('business/business-type-change', pageData)
  }
}

export const businessTypeRoutes = [
  getBusinessTypeChange
]

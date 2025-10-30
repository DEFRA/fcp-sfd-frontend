import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessTypeChangePresenter } from '../../presenters/business/business-type-change-presenter.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessTypeChange = {
  method: 'GET',
  path: '/business-type-change',
  options: {
    auth: { scope: FULL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.auth.credentials)
    const pageData = businessTypeChangePresenter(businessDetails)

    return h.view('business/business-type-change', pageData)
  }
}

export const businessTypeRoutes = [
  getBusinessTypeChange
]

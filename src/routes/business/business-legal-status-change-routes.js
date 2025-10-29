import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessLegalStatusChangePresenter } from '../../presenters/business/business-legal-status-change-presenter.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessLegalStatusChange = {
  method: 'GET',
  path: '/business-legal-status-change',
  options: {
    auth: { scope: FULL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.auth.credentials)
    const pageData = businessLegalStatusChangePresenter(businessDetails)

    return h.view('business/business-legal-status-change', pageData)
  }
}

export const businessLegalStatusRoutes = [
  getBusinessLegalStatusChange
]

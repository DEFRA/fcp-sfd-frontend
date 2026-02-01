import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'
import { checkBusinessPermissionGroupService } from '../../services/business/check-business-permission-group-service.js'

const getBusinessDetails = {
  method: 'GET',
  path: '/business-details',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    yar.clear('businessDetailsUpdate')

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    const permissionGroup = checkBusinessPermissionGroupService(request.auth.credentials.scope)
    const pageData = businessDetailsPresenter(businessDetails, yar, permissionGroup)

    return h.view('business/business-details.njk', pageData)
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails
]

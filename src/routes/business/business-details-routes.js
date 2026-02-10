import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessDetailsPresenter } from '../../presenters/business/business-details-presenter.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'
import { validateBusinessDetailsService } from '../../services/business/validate-business-details-service.js'
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
    yar.clear('businessDetailsValidation')

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    // const { hasValidBusinessDetails, sectionsNeedingUpdate } = validateBusinessDetailsService(businessDetails)

    const hasValidBusinessDetails = false
    const sectionsNeedingUpdate = ['address', 'email']

    if (!hasValidBusinessDetails) {
      yar.set('businessDetailsValidation', { businessDetailsValid: false, sectionsNeedingUpdate })
    }

    const permissionGroup = checkBusinessPermissionGroupService(request.auth.credentials.scope)
    const pageData = businessDetailsPresenter(businessDetails, yar, permissionGroup, hasValidBusinessDetails, sectionsNeedingUpdate)

    return h.view('business/business-details.njk', pageData)
  }
}

export const businessDetailsRoutes = [
  getBusinessDetails
]

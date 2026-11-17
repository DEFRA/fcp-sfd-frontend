import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { businessFixPresenter } from '../../presenters/business/business-fix-presenter.js'
import { BUSINESS_DETAILS_VALIDATION_JOURNEY } from '../../constants/journeys.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'
import { checkBusinessFixPermissionsPreHandler } from '../pre-handlers.js'

import { services } from '@defra/fcp-sfd-frontend-engine'

const getBusinessFix = {
  method: 'GET',
  path: '/business-fix',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    pre: [checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (request, h) => {
    const { yar, query, auth } = request

    const sessionData = services.initialiseFixJourney(yar, query.source, 'business')

    // No sections to fix means the journey can't start, e.g. the user has
    // already submitted and is navigating back
    if (!sessionData?.orderedSectionsToFix) {
      return h.redirect(BUSINESS_DETAILS_VALIDATION_JOURNEY.redirectPath)
    }

    const businessDetails = await fetchBusinessDetailsService(auth.credentials)
    const pageData = businessFixPresenter(sessionData, businessDetails)

    return h.view('business/business-fix.njk', pageData)
  }
}

const postBusinessFix = {
  method: 'POST',
  path: '/business-fix',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    pre: [checkBusinessFixPermissionsPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (_request, h) => {
    return h.redirect('/business-fix-list')
  }
}

export const businessFixRoutes = [
  getBusinessFix,
  postBusinessFix
]

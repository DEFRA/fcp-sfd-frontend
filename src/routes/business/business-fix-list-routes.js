import { utils, schemas, constants, services } from '@defra/fcp-sfd-frontend-engine'

import { businessFixListPresenter } from '../../presenters/business/business-fix-list-presenter.js'
import { fetchBusinessFixService } from '../../services/business/fetch-business-fix-service.js'
import { BUSINESS_DETAILS_VALIDATION_JOURNEY } from '../../constants/journeys.js'
import { checkInterrupterJourneyPreHandler } from '../pre-handlers.js'

const getBusinessFixList = {
  method: 'GET',
  path: '/business-fix-list',
  options: {
    pre: [checkInterrupterJourneyPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('businessDetailsValidation') || {}
    const businessDetails = await fetchBusinessFixService(auth.credentials, sessionData)
    const pageData = businessFixListPresenter(businessDetails)

    return h.view('business/business-fix-list.njk', pageData)
  }
}

const postBusinessFixList = {
  method: 'POST',
  path: '/business-fix-list',
  options: {
    pre: [checkInterrupterJourneyPreHandler(BUSINESS_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    const sessionData = yar.get('businessDetailsValidation')
    const validation = services.validateFixDetails(payload, sessionData.orderedSectionsToFix, schemas.business.details)

    if (validation.error) {
      const errors = utils.formatValidationErrors(validation.error.details || [])
      const businessDetails = await fetchBusinessFixService(auth.credentials, sessionData)
      const pageData = businessFixListPresenter(businessDetails, payload, errors)

      return h.view('business/business-fix-list.njk', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
    }

    services.setFixSessionData(yar, sessionData, payload, 'businessDetailsValidation', 'businessFixUpdates')

    return h.redirect('/business-fix-check')
  }
}

export const businessFixListRoutes = [
  getBusinessFixList,
  postBusinessFixList
]

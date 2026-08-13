import { utils, schemas, constants, services } from '@defra/fcp-sfd-frontend-engine'

import { personalFixListPresenter } from '../../presenters/personal/personal-fix-list-presenter.js'
import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'
import { PERSONAL_DETAILS_VALIDATION_JOURNEY } from '../../constants/journeys.js'
import { checkInterruptedJourneyPreHandler } from '../pre-handlers.js'

const getPersonalFixList = {
  method: 'GET',
  path: '/personal-fix-list',
  options: {
    pre: [checkInterruptedJourneyPreHandler(PERSONAL_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('personalDetailsValidation') || {}
    const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
    const pageData = personalFixListPresenter(personalDetails)

    return h.view('personal/personal-fix-list.njk', pageData)
  }
}

const postPersonalFixList = {
  method: 'POST',
  path: '/personal-fix-list',
  options: {
    pre: [checkInterruptedJourneyPreHandler(PERSONAL_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    const sessionData = yar.get('personalDetailsValidation')
    const validation = services.validateFixDetails(payload, sessionData.orderedSectionsToFix, schemas.personal)

    if (validation.error) {
      const errors = utils.formatValidationErrors(validation.error.details || [])
      const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
      const pageData = personalFixListPresenter(personalDetails, payload, errors)

      return h.view('personal/personal-fix-list.njk', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
    }

    services.setFixSessionData(yar, sessionData, payload, 'personalDetailsValidation', 'personalFixUpdates')

    return h.redirect('/personal-fix-check')
  }
}

export const personalFixListRoutes = [
  getPersonalFixList,
  postPersonalFixList
]

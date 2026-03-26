import { personalFixPresenter } from '../../presenters/personal/personal-fix-presenter.js'
import { initialiseFixJourneyService } from '../../services/initialise-fix-journey-service.js'
import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'
import { checkInterruptedJourneyPreHandler } from '../check-interrupter-journey-pre-handler-route.js'

const PERSONAL_DETAILS_ROUTE = '/personal-details'

const getPersonalFix = {
  method: 'GET',
  path: '/personal-fix',
  options: {
    pre: [checkInterruptedJourneyPreHandler('personalDetailsValidation', PERSONAL_DETAILS_ROUTE)]
  },
  handler: async (request, h) => {
    const { yar, query, auth } = request

    const sessionData = initialiseFixJourneyService(yar, query.source, 'personal')
    const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
    const pageData = personalFixPresenter(personalDetails)

    return h.view('personal/personal-fix.njk', pageData)
  }
}

const postPersonalFix = {
  method: 'POST',
  path: '/personal-fix',
  handler: async (_request, h) => {
    return h.redirect('/personal-fix-list')
  }
}

export const personalFixRoutes = [
  getPersonalFix,
  postPersonalFix
]

import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'
import { personalFixCheckPresenter } from '../../presenters/personal/personal-fix-check-presenter.js'
import { updatePersonalFixService } from '../../services/personal/update-personal-fix-service.js'
import { checkInterruptedJourneyPreHandler } from '../check-interrupter-journey-pre-handler-route.js'

const PERSONAL_DETAILS_ROUTE = '/personal-details'

const getPersonalFixCheck = {
  method: 'GET',
  path: '/personal-fix-check',
  options: {
    pre: [checkInterruptedJourneyPreHandler('personalDetailsValidation', PERSONAL_DETAILS_ROUTE)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('personalDetailsValidation')
    const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
    const pageData = personalFixCheckPresenter(personalDetails)

    return h.view('personal/personal-fix-check.njk', pageData)
  }
}

const postPersonalFixCheck = {
  method: 'POST',
  path: '/personal-fix-check',
  options: {
    pre: [checkInterruptedJourneyPreHandler('personalDetailsValidation', PERSONAL_DETAILS_ROUTE)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('personalDetailsValidation')
    await updatePersonalFixService(sessionData, yar, auth.credentials)

    return h.redirect(PERSONAL_DETAILS_ROUTE)
  }
}

export const personalFixCheckRoutes = [
  getPersonalFixCheck,
  postPersonalFixCheck
]

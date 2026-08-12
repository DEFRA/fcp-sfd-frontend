import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'
import { personalFixCheckPresenter } from '../../presenters/personal/personal-fix-check-presenter.js'
import { updatePersonalFixService } from '../../services/personal/update-personal-fix-service.js'
import { PERSONAL_DETAILS_VALIDATION_JOURNEY } from '../../constants/journeys.js'
import { checkInterruptedJourneyPreHandler } from '../pre-handlers.js'

const getPersonalFixCheck = {
  method: 'GET',
  path: '/personal-fix-check',
  options: {
    pre: [checkInterruptedJourneyPreHandler(PERSONAL_DETAILS_VALIDATION_JOURNEY)]
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
    pre: [checkInterruptedJourneyPreHandler(PERSONAL_DETAILS_VALIDATION_JOURNEY)]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('personalDetailsValidation')
    await updatePersonalFixService(sessionData, yar, auth.credentials)

    return h.redirect(PERSONAL_DETAILS_VALIDATION_JOURNEY.redirectPath)
  }
}

export const personalFixCheckRoutes = [
  getPersonalFixCheck,
  postPersonalFixCheck
]

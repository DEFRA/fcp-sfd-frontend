import { setPersonalFixListSessionDataService } from '../../services/personal/set-personal-fix-list-session-data-service.js'
import { personalFixListPresenter } from '../../presenters/personal/personal-fix-list-presenter.js'
import { validatePersonalFixListService } from '../../services/personal/validate-personal-fix-list-service.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { fetchPersonalFixListService } from '../../services/personal/fetch-personal-fix-list-service.js'

const getPersonalFixList = {
  method: 'GET',
  path: '/personal-fix-list',
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get(auth.credentials.sessionId)
    const personalDetails = await fetchPersonalFixListService(yar, auth.credentials)
    const pageData = personalFixListPresenter(personalDetails, sessionData)

    return h.view('personal/personal-fix-list.njk', pageData)
  }
}

const postPersonalFixList = {
  method: 'POST',
  path: '/personal-fix-list',
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    const sessionData = yar.get(auth.credentials.sessionId)
    const validation = validatePersonalFixListService(payload, sessionData.validationErrors)

    if (validation.error) {
      const errors = formatValidationErrors(validation.error.details || [])
      const personalDetails = await fetchPersonalFixListService(yar, auth.credentials)
      const pageData = personalFixListPresenter(personalDetails, sessionData, payload, errors)

      return h.view('personal/personal-fix-list.njk', { ...pageData, errors }).code(400)
    }

    setPersonalFixListSessionDataService(yar, auth.credentials.sessionId, payload, sessionData.validationErrors)

    return h.redirect('/personal-fix-check')
  }
}

export const personalFixListRoutes = [
  getPersonalFixList,
  postPersonalFixList
]

import { setPersonalFixSessionDataService } from '../../services/personal/set-personal-fix-session-data-service.js'
import { personalFixListPresenter } from '../../presenters/personal/personal-fix-list-presenter.js'
import { validateFixDetailsService } from '../../services/validate-fix-details-service.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'
import { personalDetailsSchema } from '../../schemas/personal/personal-details-schema.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getPersonalFixList = {
  method: 'GET',
  path: '/personal-fix-list',
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
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    const sessionData = yar.get('personalDetailsValidation')
    const validation = validateFixDetailsService(payload, sessionData.orderedSectionsToFix, personalDetailsSchema)

    if (validation.error) {
      const errors = formatValidationErrors(validation.error.details || [])
      const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
      const pageData = personalFixListPresenter(personalDetails, payload, errors)

      return h.view('personal/personal-fix-list.njk', { ...pageData, errors }).code(BAD_REQUEST).takeover()
    }

    setPersonalFixSessionDataService(yar, sessionData, payload)

    return h.redirect('/personal-fix-check')
  }
}

export const personalFixListRoutes = [
  getPersonalFixList,
  postPersonalFixList
]

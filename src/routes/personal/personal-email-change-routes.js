import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { personalEmailChangePresenter } from '../../presenters/personal/personal-email-change-presenter.js'
import { personalEmailSchema } from '../../schemas/personal/personal-email-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalEmailChange = {
  method: 'GET',
  path: '/account-email-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalEmail')
    const pageData = personalEmailChangePresenter(personalDetails)

    return h.view('personal/personal-email-change', pageData)
  }
}

const postPersonalEmailChange = {
  method: 'POST',
  path: '/account-email-change',
  options: {
    validate: {
      payload: personalEmailSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalEmail')
        const pageData = personalEmailChangePresenter(personalDetails, payload.personalEmail)

        return h.view('personal/personal-email-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      setSessionData(request.yar, 'personalDetails', 'changePersonalEmail', request.payload.personalEmail)

      return h.redirect('/account-email-check')
    }
  }
}

export const personalEmailChangeRoutes = [
  getPersonalEmailChange,
  postPersonalEmailChange
]

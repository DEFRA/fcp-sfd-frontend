import { personalNameSchema } from '../../schemas/personal/personal-name-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { personalNameChangePresenter } from '../../presenters/personal/personal-name-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalNameChange = {
  method: 'GET',
  path: '/account-name-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalName')
    const pageData = personalNameChangePresenter(personalDetails)

    return h.view('personal/personal-name-change', pageData)
  }
}

const postPersonalNameChange = {
  method: 'POST',
  path: '/account-name-change',
  options: {
    validate: {
      payload: personalNameSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalName')
        const pageData = personalNameChangePresenter(personalDetails, payload)

        return h.view('personal/personal-name-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      setSessionData(request.yar, 'personalDetails', 'changePersonalName', request.payload)

      return h.redirect('/account-name-check')
    }
  }
}
export const personalNameChangeRoutes = [
  getPersonalNameChange,
  postPersonalNameChange
]

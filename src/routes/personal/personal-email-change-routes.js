import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'

import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { personalEmailChangePresenter } from '../../presenters/personal/personal-email-change-presenter.js'
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
      payload: schemas.personal.email,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = utils.formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalEmail')
        const pageData = personalEmailChangePresenter(personalDetails, payload.personalEmail)

        return h.view('personal/personal-email-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      setSessionData(request.yar, 'personalDetailsUpdate', 'changePersonalEmail', request.payload.personalEmail)

      return h.redirect('/account-email-check')
    }
  }
}

export const personalEmailChangeRoutes = [
  getPersonalEmailChange,
  postPersonalEmailChange
]

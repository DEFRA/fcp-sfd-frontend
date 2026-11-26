import { constants, schemas } from '@defra/fcp-sfd-frontend-engine'

import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { checkPersonalEmailRegisteredService } from '../../services/personal/check-personal-email-registered-service.js'
import { personalEmailChangeErrorService } from '../../services/personal/personal-email-change-error-service.js'
import { personalEmailChangePresenter } from '../../presenters/personal/personal-email-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { checkPersonalFieldAccessibleGuard } from '../pre-handlers.js'

const getPersonalEmailChange = {
  method: 'GET',
  path: '/account-email-change',
  options: {
    pre: [checkPersonalFieldAccessibleGuard('email')]
  },
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
    pre: [checkPersonalFieldAccessibleGuard('email')],
    validate: {
      payload: schemas.personal.email,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request
        const pageData = await personalEmailChangeErrorService(yar, auth.credentials, payload.personalEmail, err.details)

        return h.view('personal/personal-email-change', pageData).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const { yar, auth, payload } = request

      const emailCheck = await checkPersonalEmailRegisteredService(payload.personalEmail, auth.credentials)

      if (emailCheck.error) {
        const pageData = await personalEmailChangeErrorService(yar, auth.credentials, payload.personalEmail, emailCheck.error)

        return h.view('personal/personal-email-change', pageData).code(constants.statusCodes.BAD_REQUEST).takeover()
      }

      setSessionData(yar, 'personalDetailsUpdate', 'changePersonalEmail', payload.personalEmail)

      return h.redirect('/account-email-check')
    }
  }
}

export const personalEmailChangeRoutes = [
  getPersonalEmailChange,
  postPersonalEmailChange
]

import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'

import { personalDobChangePresenter } from '../../presenters/personal/personal-dob-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalDobChange = {
  method: 'GET',
  path: '/account-date-of-birth-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob')
    const pageData = personalDobChangePresenter(personalDetails)
    return h.view('personal/personal-dob-change', pageData)
  }
}

const postPersonalDobChange = {
  method: 'POST',
  path: '/account-date-of-birth-change',
  options: {
    validate: {
      payload: schemas.personal.dob,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = utils.formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob')
        const pageData = personalDobChangePresenter(personalDetails, payload)

        return h.view('personal/personal-dob-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      setSessionData(request.yar, 'personalDetailsUpdate', 'changePersonalDob', request.payload)

      return h.redirect('/account-date-of-birth-check')
    }
  }
}

export const personalDobChangeRoutes = [
  getPersonalDobChange,
  postPersonalDobChange
]

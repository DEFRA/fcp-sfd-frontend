import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'

import { personalDobChangePresenter } from '../../presenters/personal/personal-dob-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { isPersonalFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getPersonalDobChange = {
  method: 'GET',
  path: '/account-date-of-birth-change',
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isPersonalFieldAccessible('dob')) {
      const pageData = personalDobChangePresenter(await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob'))
      return h.view('personal/personal-dob-change', {
        ...pageData,
        notification: getDisabledFieldNotification('date of birth')
      }).code(constants.statusCodes.LOCKED)
    }

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

        if (!isPersonalFieldAccessible('dob')) {
          const errors = utils.formatValidationErrors(err.details || [])
          const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob')
          const pageData = personalDobChangePresenter(personalDetails, payload)
          return h.view('personal/personal-dob-change', {
            ...pageData,
            errors,
            notification: getDisabledFieldNotification('date of birth')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const errors = utils.formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob')
        const pageData = personalDobChangePresenter(personalDetails, payload)

        return h.view('personal/personal-dob-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      if (!isPersonalFieldAccessible('dob')) {
        return h.view('personal/personal-dob-change', {
          backLink: { href: '/personal-details' },
          pageTitle: 'What is your date of birth?',
          metaDescription: 'Update your date of birth.',
          notification: getDisabledFieldNotification('date of birth')
        }).code(constants.statusCodes.LOCKED)
      }

      const { yar, payload } = request

      setSessionData(yar, 'personalDetailsUpdate', 'changePersonalDob', payload)

      return h.redirect('/account-date-of-birth-check')
    }
  }
}

export const personalDobChangeRoutes = [
  getPersonalDobChange,
  postPersonalDobChange
]

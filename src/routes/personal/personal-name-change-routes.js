import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'

import { personalNameChangePresenter } from '../../presenters/personal/personal-name-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { isPersonalFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getPersonalNameChange = {
  method: 'GET',
  path: '/account-name-change',
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isPersonalFieldAccessible('name')) {
      const pageData = personalNameChangePresenter(await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalName'))
      return h.view('personal/personal-name-change', {
        ...pageData,
        notification: getDisabledFieldNotification('full name')
      }).code(constants.statusCodes.LOCKED)
    }

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
      payload: schemas.personal.name,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        if (!isPersonalFieldAccessible('name')) {
          const errors = utils.formatValidationErrors(err.details || [])
          const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalName')
          const pageData = personalNameChangePresenter(personalDetails, payload)
          return h.view('personal/personal-name-change', {
            ...pageData,
            errors,
            notification: getDisabledFieldNotification('full name')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const errors = utils.formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalName')
        const pageData = personalNameChangePresenter(personalDetails, payload)

        return h.view('personal/personal-name-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      if (!isPersonalFieldAccessible('name')) {
        return h.view('personal/personal-name-change', {
          backLink: { href: '/personal-details' },
          pageTitle: 'What is your full name?',
          metaDescription: 'Update the full name for your personal account.',
          notification: getDisabledFieldNotification('full name')
        }).code(constants.statusCodes.LOCKED)
      }

      const { yar, payload } = request

      setSessionData(yar, 'personalDetailsUpdate', 'changePersonalName', payload)

      return h.redirect('/account-name-check')
    }
  }
}
export const personalNameChangeRoutes = [
  getPersonalNameChange,
  postPersonalNameChange
]

import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'

import { personalPhoneNumbersChangePresenter } from '../../presenters/personal/personal-phone-numbers-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { isPersonalFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getPersonalPhoneNumbersChange = {
  method: 'GET',
  path: '/account-phone-numbers-change',
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isPersonalFieldAccessible('phone')) {
      const pageData = personalPhoneNumbersChangePresenter(await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers'))
      return h.view('personal/personal-phone-numbers-change', {
        ...pageData,
        notification: getDisabledFieldNotification('personal phone numbers')
      }).code(constants.statusCodes.LOCKED)
    }

    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers')
    const pageData = personalPhoneNumbersChangePresenter(personalDetails)

    return h.view('personal/personal-phone-numbers-change', pageData)
  }
}

const postPersonalPhoneNumbersChange = {
  method: 'POST',
  path: '/account-phone-numbers-change',
  options: {
    validate: {
      payload: schemas.personal.phone,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        if (!isPersonalFieldAccessible('phone')) {
          const errors = utils.formatValidationErrors(err.details || [])
          const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers')
          const pageData = personalPhoneNumbersChangePresenter(personalDetails, payload)
          return h.view('personal/personal-phone-numbers-change', {
            ...pageData,
            errors,
            notification: getDisabledFieldNotification('personal phone numbers')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const errors = utils.formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers')
        const pageData = personalPhoneNumbersChangePresenter(personalDetails, payload)

        return h.view('personal/personal-phone-numbers-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      if (!isPersonalFieldAccessible('phone')) {
        return h.view('personal/personal-phone-numbers-change', {
          backLink: { href: '/personal-details' },
          pageTitle: 'What are your phone numbers?',
          notification: getDisabledFieldNotification('personal phone numbers')
        }).code(constants.statusCodes.LOCKED)
      }

      const { yar, payload } = request

      // If a user didn't enter either of the numbers default its value to null
      const phoneNumbers = {
        personalTelephone: payload.personalTelephone ?? null,
        personalMobile: payload.personalMobile ?? null
      }

      setSessionData(yar, 'personalDetailsUpdate', 'changePersonalPhoneNumbers', phoneNumbers)

      return h.redirect('/account-phone-numbers-check')
    }
  }
}

export const personalPhoneNumbersChangeRoutes = [
  getPersonalPhoneNumbersChange,
  postPersonalPhoneNumbersChange
]


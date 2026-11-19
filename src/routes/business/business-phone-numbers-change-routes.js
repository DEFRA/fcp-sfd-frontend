import { utils, schemas, constants } from '@defra/fcp-sfd-frontend-engine'

import { businessPhoneNumbersChangePresenter } from '../../presenters/business/business-phone-numbers-change-presenter.js'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'
import { isBusinessFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isBusinessFieldAccessible('phone')) {
      const pageData = businessPhoneNumbersChangePresenter(await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers'))
      return h.view('business/business-phone-numbers-change', {
        ...pageData,
        notification: getDisabledFieldNotification('business phone numbers')
      }).code(constants.statusCodes.LOCKED)
    }

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers')
    const pageData = businessPhoneNumbersChangePresenter(businessDetails)

    return h.view('business/business-phone-numbers-change', pageData)
  }
}

const postBusinessPhoneNumbersChange = {
  method: 'POST',
  path: '/business-phone-numbers-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    validate: {
      payload: schemas.business.details.phone,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        if (!isBusinessFieldAccessible('phone')) {
          const errors = utils.formatValidationErrors(err.details || [])
          const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers')
          const pageData = businessPhoneNumbersChangePresenter(businessDetails, payload)
          return h.view('business/business-phone-numbers-change', {
            ...pageData,
            errors,
            notification: getDisabledFieldNotification('business phone numbers')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const errors = utils.formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers')
        const pageData = businessPhoneNumbersChangePresenter(businessDetails, payload)

        return h.view('business/business-phone-numbers-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      if (!isBusinessFieldAccessible('phone')) {
        return h.view('business/business-phone-numbers-change', {
          backLink: { href: '/business-details' },
          pageTitle: 'What are the business phone numbers?',
          notification: getDisabledFieldNotification('business phone numbers')
        }).code(constants.statusCodes.LOCKED)
      }

      const { yar, payload } = request

      // If a user didn't enter either of the numbers default its value to null
      const phoneNumbers = {
        businessTelephone: payload.businessTelephone ?? null,
        businessMobile: payload.businessMobile ?? null
      }

      setSessionData(yar, 'businessDetailsUpdate', 'changeBusinessPhoneNumbers', phoneNumbers)

      return h.redirect('/business-phone-numbers-check')
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumbersChange,
  postBusinessPhoneNumbersChange
]


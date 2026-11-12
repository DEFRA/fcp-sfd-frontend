import { utils, constants, schemas } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessVatChangePresenter } from '../../presenters/business/business-vat-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { isBusinessFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getBusinessVatChange = {
  method: 'GET',
  path: '/business-vat-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isBusinessFieldAccessible('vat')) {
      const pageData = businessVatChangePresenter(await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat'))
      return h.view('business/business-vat-registration-number-change', {
        ...pageData,
        notification: getDisabledFieldNotification('business VAT registration number')
      }).code(constants.statusCodes.LOCKED)
    }

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat')
    const pageData = businessVatChangePresenter(businessDetails)

    return h.view('business/business-vat-registration-number-change', pageData)
  }
}

const postBusinessVatChange = {
  method: 'POST',
  path: '/business-vat-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    validate: {
      payload: schemas.business.vat.change,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        if (!isBusinessFieldAccessible('vat')) {
          const errors = utils.formatValidationErrors(err.details || [])
          const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat')
          const pageData = businessVatChangePresenter(businessDetails, payload.vatNumber)
          return h.view('business/business-vat-registration-number-change', {
            ...pageData,
            errors,
            notification: getDisabledFieldNotification('business VAT registration number')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const errors = utils.formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat')
        const pageData = businessVatChangePresenter(businessDetails, payload.vatNumber)

        return h.view('business/business-vat-registration-number-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      if (!isBusinessFieldAccessible('vat')) {
        return h.view('business/business-vat-registration-number-change', {
          backLink: { href: '/business-details' },
          pageTitle: 'What is the VAT registration number?',
          notification: getDisabledFieldNotification('business VAT registration number')
        }).code(constants.statusCodes.LOCKED)
      }

      const { yar, payload } = request

      setSessionData(yar, 'businessDetailsUpdate', 'changeBusinessVat', payload.vatNumber)

      return h.redirect('/business-vat-registration-number-check')
    }
  }
}

export const businessVatChangeRoutes = [
  getBusinessVatChange,
  postBusinessVatChange
]


import { constants, schemas } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessAddressChangePresenter } from '../../presenters/business/business-address-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { addressLookupService } from '../../services/os-places/address-lookup-service.js'
import { businessAddressChangeErrorService } from '../../services/business/business-address-change-error-service.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'
import { isBusinessFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getBusinessAddressChange = {
  method: 'GET',
  path: '/business-address-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isBusinessFieldAccessible('address')) {
      const pageData = businessAddressChangePresenter(await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPostcode'))
      return h.view('business/business-address-change', {
        ...pageData,
        notification: getDisabledFieldNotification('business address')
      }).code(constants.statusCodes.LOCKED)
    }

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPostcode')
    const pageData = businessAddressChangePresenter(businessDetails)

    return h.view('business/business-address-change', pageData)
  }
}

const postBusinessAddressChange = {
  method: 'POST',
  path: '/business-address-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    validate: {
      payload: schemas.osPlaces.ukPostcode,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        if (!isBusinessFieldAccessible('address')) {
          const pageData = await businessAddressChangeErrorService(yar, auth.credentials, payload.postcode, err.details)
          return h.view('business/business-address-change', {
            ...pageData,
            notification: getDisabledFieldNotification('business address')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const pageData = await businessAddressChangeErrorService(yar, auth.credentials, payload.postcode, err.details)

        return h.view('business/business-address-change', pageData).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    }
  },
  handler: async (request, h) => {
    if (!isBusinessFieldAccessible('address')) {
      return h.view('business/business-address-change', {
        backLink: { href: '/business-details' },
        pageTitle: 'What is the business address?',
        notification: getDisabledFieldNotification('business address')
      }).code(constants.statusCodes.LOCKED)
    }

    const { yar, auth, payload } = request

    setSessionData(yar, 'businessDetailsUpdate', 'changeBusinessPostcode', payload)
    const addresses = await addressLookupService(payload.postcode, yar, 'business')

    if (addresses.error) {
      const pageData = await businessAddressChangeErrorService(yar, auth.credentials, payload.postcode, addresses.error)

      return h.view('business/business-address-change', pageData).code(constants.statusCodes.BAD_REQUEST).takeover()
    }

    return h.redirect('/business-address-select')
  }
}

export const businessAddressChangeRoutes = [
  getBusinessAddressChange,
  postBusinessAddressChange
]


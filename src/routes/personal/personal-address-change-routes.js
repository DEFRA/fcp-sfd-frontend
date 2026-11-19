import { constants, schemas } from '@defra/fcp-sfd-frontend-engine'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { personalAddressChangePresenter } from '../../presenters/personal/personal-address-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { addressLookupService } from '../../services/os-places/address-lookup-service.js'
import { personalAddressChangeErrorService } from '../../services/personal/personal-address-change-error-service.js'
import { isPersonalFieldAccessible, getDisabledFieldNotification } from '../../utils/feature-toggle/check-field-accessibility.js'

const getPersonalAddressChange = {
  method: 'GET',
  path: '/account-address-change',
  handler: async (request, h) => {
    const { yar, auth } = request

    if (!isPersonalFieldAccessible('address')) {
      const pageData = personalAddressChangePresenter(await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPostcode'))
      return h.view('personal/personal-address-change', {
        ...pageData,
        notification: getDisabledFieldNotification('personal address')
      }).code(constants.statusCodes.LOCKED)
    }

    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPostcode')
    const pageData = personalAddressChangePresenter(personalDetails)

    return h.view('personal/personal-address-change', pageData)
  }
}

const postPersonalAddressChange = {
  method: 'POST',
  path: '/account-address-change',
  options: {
    validate: {
      payload: schemas.osPlaces.ukPostcode,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        if (!isPersonalFieldAccessible('address')) {
          const pageData = await personalAddressChangeErrorService(yar, auth.credentials, payload.postcode, err.details)
          return h.view('personal/personal-address-change', {
            ...pageData,
            notification: getDisabledFieldNotification('personal address')
          }).code(constants.statusCodes.BAD_REQUEST).takeover()
        }

        const pageData = await personalAddressChangeErrorService(yar, auth.credentials, payload.postcode, err.details)

        return h.view('personal/personal-address-change', pageData).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    }
  },
  handler: async (request, h) => {
    if (!isPersonalFieldAccessible('address')) {
      return h.view('personal/personal-address-change', {
        backLink: { href: '/personal-details' },
        pageTitle: 'What is your personal address?',
        notification: getDisabledFieldNotification('personal address')
      }).code(constants.statusCodes.LOCKED)
    }

    const { yar, auth, payload } = request

    setSessionData(yar, 'personalDetailsUpdate', 'changePersonalPostcode', payload)
    const addresses = await addressLookupService(payload.postcode, yar, 'personal')

    if (addresses.error) {
      const pageData = await personalAddressChangeErrorService(yar, auth.credentials, payload.postcode, addresses.error)

      return h.view('personal/personal-address-change', pageData).code(constants.statusCodes.BAD_REQUEST).takeover()
    }

    return h.redirect('/account-address-select')
  }
}

export const personalAddressChangeRoutes = [
  getPersonalAddressChange,
  postPersonalAddressChange
]


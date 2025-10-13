import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { ukPostcodeSchema } from '../../schemas/os-places/uk-postcode-schema.js'
import { personalAddressChangePresenter } from '../../presenters/personal/personal-address-change-presenter.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { addressLookupService } from '../../services/os-places/address-lookup-service.js'
import { personalAddressChangeErrorService } from '../../services/personal/personal-address-change-error-service.js'

const getPersonalAddressChange = {
  method: 'GET',
  path: '/account-address-change',
  handler: async (request, h) => {
    const { yar, auth } = request
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
      payload: ukPostcodeSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request
        const pageData = await personalAddressChangeErrorService(yar, auth.credentials, payload.personalPostcode, err.details)

        return h.view('personal/personal-address-change', pageData).code(BAD_REQUEST).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    setSessionData(yar, 'personalDetails', 'changePersonalPostcode', payload)
    const addresses = await addressLookupService(payload.postcode, yar, 'personal')

    if (addresses.error) {
      const pageData = await personalAddressChangeErrorService(yar, auth.credentials, payload.personalPostcode, addresses.error)

      return h.view('personal/personal-address-change', pageData).code(BAD_REQUEST).takeover()
    }

    return h.redirect('/account-address-select')
  }
}

export const personalAddressChangeRoutes = [
  getPersonalAddressChange,
  postPersonalAddressChange
]

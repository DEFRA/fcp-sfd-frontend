import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { addressSchema } from '../../schemas/address-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { personalAddressEnterPresenter } from '../../presenters/personal/personal-address-enter-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalAddressEnter = {
  method: 'GET',
  path: '/account-address-enter',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalAddress')
    const pageData = personalAddressEnterPresenter(personalDetails)

    return h.view('personal/personal-address-enter', pageData)
  }
}

const postPersonalAddressEnter = {
  method: 'POST',
  path: '/account-address-enter',
  options: {
    validate: {
      payload: addressSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalAddress')
        const pageData = personalAddressEnterPresenter(personalDetails, payload)

        return h.view('personal/personal-address-enter', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      setSessionData(request.yar, 'personalDetailsUpdate', 'changePersonalAddress', request.payload)

      return h.redirect('/account-address-check')
    }
  }
}

export const personalAddressEnterRoutes = [
  getPersonalAddressEnter,
  postPersonalAddressEnter
]

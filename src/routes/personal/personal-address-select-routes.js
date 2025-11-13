import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { personalAddressSelectPresenter } from '../../presenters/personal/personal-address-select-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { addressesSchema } from '../../schemas/os-places/addresses-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'

const getPersonalAddressSelect = {
  method: 'GET',
  path: '/account-address-select',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, ['changePersonalPostcode', 'changePersonalAddresses', 'changePersonalAddress'])
    const pageData = personalAddressSelectPresenter(personalDetails)

    return h.view('personal/personal-address-select', pageData)
  }
}

const postPersonalAddressSelect = {
  method: 'POST',
  path: '/account-address-select',
  options: {
    auth: { scope: VIEW_PERMISSIONS },
    validate: {
      payload: addressesSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth } = request

        const errors = formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, ['changePersonalPostcode', 'changePersonalAddresses'])
        const pageData = personalAddressSelectPresenter(personalDetails)

        return h.view('personal/personal-address-select', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const personalDetails = await fetchPersonalChangeService(request.yar, request.auth.credentials, 'changePersonalAddresses')

      const selectedAddress = personalDetails.changePersonalAddresses.find((address) => {
        return `${address.uprn}${address.displayAddress}` === request.payload.addresses
      })

      selectedAddress.postcodeLookup = true

      setSessionData(request.yar, 'personalDetails', 'changePersonalAddress', selectedAddress)

      return h.redirect('/account-address-check')
    }
  }
}

export const personalAddressSelectRoutes = [
  getPersonalAddressSelect,
  postPersonalAddressSelect
]

import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { personalAddressSelectChangePresenter } from '../../presenters/personal/personal-address-select-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { personalAddressesSchema } from '../../schemas/personal/personal-addresses-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getPersonalAddressSelectChange = {
  method: 'GET',
  path: '/account-address-select',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, ['changePersonalPostcode', 'changePersonalAddresses'])
    const pageData = personalAddressSelectChangePresenter(personalDetails)

    return h.view('personal/personal-address-select-change', pageData)
  }
}

const postPersonalAddressSelectChange = {
  method: 'POST',
  path: '/account-address-select',
  options: {
    validate: {
      payload: personalAddressesSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth } = request

        const errors = formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, ['changePersonalPostcode', 'changePersonalAddresses'])
        const pageData = personalAddressSelectChangePresenter(personalDetails)

        return h.view('personal/personal-address-select-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
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

export const personalAddressSelectChangeRoutes = [
  getPersonalAddressSelectChange,
  postPersonalAddressSelectChange
]

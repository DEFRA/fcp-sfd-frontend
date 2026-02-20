import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessAddressSelectPresenter } from '../../presenters/business/business-address-select-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { addressesSchema } from '../../schemas/os-places/addresses-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessAddressSelect = {
  method: 'GET',
  path: '/business-address-select',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, ['changeBusinessPostcode', 'changeBusinessAddresses', 'changeBusinessAddress'])
    const pageData = businessAddressSelectPresenter(businessDetails)

    return h.view('business/business-address-select', pageData)
  }
}

const postBusinessAddressSelect = {
  method: 'POST',
  path: '/business-address-select',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    validate: {
      payload: addressesSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth } = request

        const errors = formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, ['changeBusinessPostcode', 'changeBusinessAddresses'])
        const pageData = businessAddressSelectPresenter(businessDetails)

        return h.view('business/business-address-select', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const businessDetails = await fetchBusinessChangeService(request.yar, request.auth.credentials, 'changeBusinessAddresses')

      const selectedAddress = businessDetails.changeBusinessAddresses.find((address) => {
        return `${address.uprn}${address.displayAddress}` === request.payload.addresses
      })

      selectedAddress.postcodeLookup = true

      setSessionData(request.yar, 'businessDetailsUpdate', 'changeBusinessAddress', selectedAddress)

      return h.redirect('/business-address-check')
    }
  }
}

export const businessAddressSelectRoutes = [
  getBusinessAddressSelect,
  postBusinessAddressSelect
]

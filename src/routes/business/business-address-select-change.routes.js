import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessAddressSelectChangePresenter } from '../../presenters/business/business-address-select-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { businessAddressesSchema } from '../../schemas/business/business-addresses-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessAddressSelectChange = {
  method: 'GET',
  path: '/business-address-select-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, ['changeBusinessPostcode', 'changeBusinessAddresses'])
    const pageData = businessAddressSelectChangePresenter(businessDetails)

    return h.view('business/business-address-select-change', pageData)
  }
}

const postBusinessAddressSelectChange = {
  method: 'POST',
  path: '/business-address-select-change',
  options: {
    validate: {
      payload: businessAddressesSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth } = request

        const errors = formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, ['changeBusinessPostcode', 'changeBusinessAddresses'])
        const pageData = businessAddressSelectChangePresenter(businessDetails)

        return h.view('business/business-address-select-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const businessDetails = await fetchBusinessChangeService(request.yar, request.auth.credentials, 'changeBusinessAddresses')

      const selectedAddress = businessDetails.changeBusinessAddresses.find((address) => {
        return `${address.uprn}${address.displayAddress}` === request.payload.addresses
      })

      selectedAddress.postcodeLookup = true

      setSessionData(request.yar, 'businessDetails', 'changeBusinessAddress', selectedAddress)

      return h.redirect('/business-address-check')
    }
  }
}

export const businessAddressSelectChangeRoutes = [
  getBusinessAddressSelectChange,
  postBusinessAddressSelectChange
]

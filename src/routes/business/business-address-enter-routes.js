import { businessAddressSchema } from '../../schemas/business/business-address-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessAddressEnterPresenter } from '../../presenters/business/business-address-enter-presenter.js'

const getBusinessAddressEnter = {
  method: 'GET',
  path: '/business-address-enter',
  handler: async (request, h) => {
    const businessDetailsData = request.yar.get('businessDetails')

    // Retrieve the previously entered address in case the user has gone back to amend it.
    // This allows us to pre-populate the form with their previous input.
    const payloadAddress = request.yar.get('businessAddress')
    const pageData = businessAddressEnterPresenter(businessDetailsData, payloadAddress)

    return h.view('business/business-address-enter', pageData)
  }
}

const postBusinessAddressEnter = {
  method: 'POST',
  path: '/business-address-enter',
  options: {
    validate: {
      payload: businessAddressSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details ?? [])
        const businessDetailsData = request.yar.get('businessDetails')
        const pageData = businessAddressEnterPresenter(businessDetailsData, request.payload)

        return h.view('business/business-address-enter', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      request.yar.set('businessAddress', request.payload)

      return h.redirect('/business-address-check')
    }
  }
}

export const businessAddressRoutes = [
  getBusinessAddressEnter,
  postBusinessAddressEnter
]

import { businessAddressSchema } from '../../schemas/business/business-address-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessAddressEnter = {
  method: 'GET',
  path: '/business-address-enter',
  handler: (request, h) => {
    const address1 = request.state.address1 || '10 Skirbeck Way'
    const address2 = request.state.address2 || ''
    const addressCity = request.state.addressCity || 'Maidstone'
    const addressCounty = request.state.addressCounty || ''
    const addressPostcode = request.state.addressPostcode || 'SK22 1DL'
    const addressCountry = request.state.addressCountry || 'United Kingdom'

    const originalAddress = {
      address1,
      address2,
      addressCity,
      addressCounty,
      addressPostcode,
      addressCountry
    }

    return h.view('business/business-address-enter', {
      address1,
      address2,
      addressCity,
      addressCounty,
      addressPostcode,
      addressCountry
    }).state('originalAddress', JSON.stringify(originalAddress))
  }
}

const postBusinessAddressEnter = {
  method: 'POST',
  path: '/business-address-enter',
  options: {
    validate: {
      payload: businessAddressSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])

        return h.view('business/business-address-enter', {
          address1: request.payload?.address1 || '',
          address2: request.payload?.address2 || '',
          addressCity: request.payload?.addressCity || '',
          addressCounty: request.payload?.addressCounty || '',
          addressPostcode: request.payload?.addressPostcode || '',
          addressCountry: request.payload?.addressCountry || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      const {
        address1,
        address2,
        addressCity,
        addressCounty,
        addressPostcode,
        addressCountry
      } = request.payload

      return h.redirect('/business-address-check')
        .state('address1', address1)
        .state('address2', address2)
        .state('addressCity', addressCity)
        .state('addressCounty', addressCounty)
        .state('addressPostcode', addressPostcode)
        .state('addressCountry', addressCountry)
        .unstate('originalAddress')
    }
  }
}

export const businessAddressRoutes = [
  getBusinessAddressEnter,
  postBusinessAddressEnter
]

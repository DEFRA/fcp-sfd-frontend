import { businessAddressSchema } from '../../schemas/business/business-address-schema.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessAddressEnter = {
  method: 'GET',
  path: '/business-address-enter',
  handler: (request, h) => {
    const address1 = request.state.address1 || '10 Skirbeck Way'
    const address2 = request.state.address2 || ''
    const city = request.state.city || 'Maidstone'
    const county = request.state.county || ''
    const postcode = request.state.postcode || 'SK22 1DL'
    const country = request.state.country || 'United Kingdom'

    const originalAddress = {
      address1,
      address2,
      city,
      county,
      postcode,
      country
    }

    return h.view('business/business-address-enter', {
      address1,
      address2,
      city,
      county,
      postcode,
      country
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
          city: request.payload?.city || '',
          county: request.payload?.county || '',
          postcode: request.payload?.postcode || '',
          country: request.payload?.country || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      const {
        address1,
        address2,
        city,
        county,
        postcode,
        country
      } = request.payload

      return h.redirect('/business-address-check')
        .state('address1', address1)
        .state('address2', address2)
        .state('city', city)
        .state('county', county)
        .state('postcode', postcode)
        .state('country', country)
        .unstate('originalAddress')
    }
  }
}

export const businessAddressRoutes = [
  getBusinessAddressEnter,
  postBusinessAddressEnter
]

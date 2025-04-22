import { businessPhoneSchema } from '../../schemas/business-details/business-phone-change.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

export const getBusinessPhoneChange = {
  method: 'GET',
  path: '/business-phone-change',
  handler: (request, h) => {
    const currentBusinessTelephone = request.state.businessTelephone || '01632 960000'
    const currentBusinessMobile = request.state.businessMobile || '07700 900 967'
    const originalBusinessTelephone = request.state.originalBusinessTelephone || currentBusinessTelephone
    const originalBusinessMobile = request.state.originalBusinessMobile || currentBusinessMobile

    return h.view('business-details/business-phone-change', {
      businessTelephone: currentBusinessTelephone,
      businessMobile: currentBusinessMobile
    })
      .state('originalBusinessTelephone', originalBusinessTelephone)
      .state('originalBusinessMobile', originalBusinessMobile)
  }
}

export const postBusinessPhoneChange = {
  method: 'POST',
  path: 'business-phone-change',
  options: {
    validate: {
      payload: businessPhoneSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])

        return h.view('business-details/business-phone-change', {
          businessTelephone: request.payload?.businessTelephone || '',
          businessMobile: request.payload?.businessMobile || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      const { businessTelephone, businessMobile } = request.payload

      return h.redirect('/business-phone-check')
        .state('businessTelephone', businessTelephone)
        .state('businessMobile', businessMobile)
    }
  }
}

export const businessPhoneChangeRoutes = [
  getBusinessPhoneChange,
  postBusinessPhoneChange
]

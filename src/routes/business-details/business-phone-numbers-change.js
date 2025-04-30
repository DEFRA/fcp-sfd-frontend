import { businessPhoneSchema } from '../../schemas/business-details/business-phone.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

export const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  handler: (request, h) => {
    const currentBusinessTelephone = request.state.businessTelephone || ''
    const originalBusinessTelephone = request.state.originalBusinessTelephone || currentBusinessTelephone
    const currentBusinessMobile = request.state.businessMobile || ''
    const originalBusinessMobile = request.state.originalBusinessMobile || currentBusinessMobile

    return h.view('business-details/business-phone-numbers-change', {
      businessTelephone: currentBusinessTelephone,
      businessMobile: currentBusinessMobile
    })
      .state('originalBusinessTelephone', originalBusinessTelephone)
      .state('originalBusinessMobile', originalBusinessMobile)
  }
}

export const postBusinessPhoneNumbersChange = {
  method: 'POST',
  path: '/business-phone-numbers-change',
  options: {
    validate: {
      payload: businessPhoneSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])

        return h.view('business-details/business-phone-numbers-change', {
          businessTelephone: request.payload?.businessTelephone || '',
          businessMobile: request.payload?.businessMobile || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      const { businessTelephone, businessMobile } = request.payload

      return h.redirect('/business-phone-numbers-check')
        .state('tempBusinessTelephone', businessTelephone)
        .state('tempBusinessMobile', businessMobile)
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumbersChange,
  postBusinessPhoneNumbersChange
]

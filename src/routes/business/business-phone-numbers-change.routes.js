import { businessPhoneSchema } from '../../schemas/business-details/business-phone.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  handler: (request, h) => {
    const currentBusinessTelephone =
      request.state.tempBusinessTelephone ??
      request.state.businessTelephone ??
      ''
    const currentBusinessMobile =
      request.state.tempBusinessMobile ??
      request.state.businessMobile ??
      ''

    const originalBusinessTelephone =
      request.state.originalBusinessTelephone ??
      request.state.businessTelephone ??
      ''

    const originalBusinessMobile =
      request.state.originalBusinessMobile ??
      request.state.businessMobile ??
      ''

    return h.view('business-details/business-phone-numbers-change', {
      businessTelephone: currentBusinessTelephone,
      businessMobile: currentBusinessMobile
    })
      .state('originalBusinessTelephone', originalBusinessTelephone)
      .state('originalBusinessMobile', originalBusinessMobile)
  }
}

const postBusinessPhoneNumbersChange = {
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

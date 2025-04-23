import { businessPhoneSchema } from '../../schemas/business-details/business-phone.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

export const getBusinessPhoneNumberChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  handler: (_, h) => {
    return h.view('business-details/business-phone-numbers-change')
  }
}

export const postBusinessPhoneNumberChange = {
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
    handler: (_, h) => {
      return h.redirect('/business-phone-numbers-check')
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumberChange,
  postBusinessPhoneNumberChange
]

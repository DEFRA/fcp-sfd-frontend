import { businessEmailSchema } from '../../schemas/business-details/business-email.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessEmailChange = {
  method: 'GET',
  path: '/business-email-change',
  handler: (request, h) => {
    const currentBusinessEmail = request.state.businessEmail || ''
    const originalBusinessEmail = request.state.originalBusinessEmail || currentBusinessEmail

    return h.view('business-details/business-email-change', {
      businessEmail: currentBusinessEmail
    }).state('originalBusinessEmail', originalBusinessEmail)
  }
}

const postBusinessEmailChange = {
  method: 'POST',
  path: '/business-email-change',
  options: {
    validate: {
      payload: businessEmailSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])

        return h.view('business-details/business-email-change', {
          businessEmail: request.payload?.businessEmail || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      const { businessEmail } = request.payload

      return h.redirect('/business-email-check')
        .state('businessEmail', businessEmail)
    }
  }
}

export const businessEmailChangeRoutes = [
  getBusinessEmailChange,
  postBusinessEmailChange
]

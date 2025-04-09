import { businessNameSchema } from '../../schemas/business-details/business-name-change.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { OK } from '../../constants/error-codes.js'

export const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: (request, h) => {
    const currentBusinessName = request.state.businessName || 'Agile Farm Ltd'
    const originalBusinessName = request.state.originalBusinessName || currentBusinessName

    return h.view('business-details/business-name-change', {
      businessName: currentBusinessName
    }).state('originalBusinessName', originalBusinessName)
  }
}

export const postBusinessNameChange = {
  method: 'POST',
  path: '/business-name-change',
  options: {
    validate: {
      payload: businessNameSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])

        return h.view('business-details/business-name-change', {
          businessName: request.payload?.businessName || '',
          errors
        }).code(OK).takeover()
      }
    },
    handler: (request, h) => {
      const { businessName } = request.payload

      return h.redirect('/business-name-check')
        .state('businessName', businessName)
    }
  }
}

export const businessNameChangeRoutes = [
  getBusinessNameChange,
  postBusinessNameChange
]

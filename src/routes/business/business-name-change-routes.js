import { businessNameSchema } from '../../schemas/business/business-name-schema.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessNameChangeService } from '../../services/business/business-name-change.service.js'

const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: async (request, h) => {
    const pageData = await businessNameChangeService(request.state)

    return h.view('business/business-name-change', pageData)
  }
}

const postBusinessNameChange = {
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

        return h.view('business/business-name-change', {
          businessName: request.payload?.businessName || '',
          errors
        }).code(BAD_REQUEST).takeover()
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

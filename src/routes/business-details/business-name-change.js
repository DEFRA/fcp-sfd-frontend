import { businessNameSchema } from '../../schemas/validationFields.js'

export const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: (_, h) => {
    return h.view('business-details/business-name-change')
  }
}

export const postBusinessNameChange = {
  method: 'POST',
  path: '/business-name-change',
  options: {
    validate: {
      payload:
        businessNameSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = {}

        if (err.details) {
          err.details.forEach(detail => {
            const path = detail.path[0]
            errors[path] = {
              text: detail.message
            }
          })
        }

        return h.view('business-details/business-name-change', {
          businessName: request.payload?.businessName || '',
          errors
        }).code(400).takeover()
      }
    },
    handler: (_, h) => {
      return h.redirect('/business-name-check')
    }
  }
}

export const businessNameChangeRoutes = [
  getBusinessNameChange,
  postBusinessNameChange
]

import { businessNameSchema } from '../../schemas/validationFields.js'

export const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: (request, h) => {
    // TO DO businessName must be pulled from either parent object that hold business details or from api call. Line 9 is a dummy placeholder
    const businessName = request.state.businessName || 'Agile Farm Ltd'

    return h.view('business-details/business-name-change', {
      businessName
    })
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

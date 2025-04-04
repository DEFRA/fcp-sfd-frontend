import { businessNameValidation } from './business-details-schema.js'

export const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: (request, h) => {
    return h.view('business-details/business-name-change', {
      pageTitle: 'What is your business name?',
      heading: 'Update the name for your business.'
    })
  }
}

export const postBusinessNameChange = {
  method: 'POST',
  path: '/business-name-change',
  options: {
    validate: {
      payload:
        businessNameValidation,
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
          pageTitle: 'What is your business name?',
          heading: 'Update the name for your business.',
          businessName: request.payload?.businessName || '',
          errors
        }).code(400).takeover()
      }
    },
    handler: (request, h) => {
      return h.redirect('/placeholder-for-parent-page')
    }
  }
}

export const businessNameChangeRoutes = [
  getBusinessNameChange,
  postBusinessNameChange
]

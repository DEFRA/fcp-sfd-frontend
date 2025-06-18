import { fetchBusinessEmailChangeService } from '../../services/business/fetch-business-email-change-service.js'
import { setBusinessEmailChangeService } from '../../services/business/set-business-email-change-service.js'
import { businessEmailChangePresenter } from '../../presenters/business/business-email-change-presenter.js'
import { businessEmailSchema } from '../../schemas/business/business-email-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessEmailChange = {
  method: 'GET',
  path: '/business-email-change',
  handler: async (request, h) => {
    const businessEmailChange = await fetchBusinessEmailChangeService(request.yar)
    const pageData = businessEmailChangePresenter(businessEmailChange, request.yar)

    return h.view('business/business-email-change.njk', pageData)
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

        return h.view('business/business-email-change', {
          businessEmail: request.payload?.businessEmail || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      await setBusinessEmailChangeService(request.payload.businessEmail, request.yar)

      return h.redirect('/business-email-check')
    }
  }
}

export const businessEmailChangeRoutes = [
  getBusinessEmailChange,
  postBusinessEmailChange
]

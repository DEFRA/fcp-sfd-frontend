import { fetchBusinessNameChangeService } from '../../services/business/fetch-business-name-change-service.js'
import { businessNameChangePresenter } from '../../presenters/business/business-name-change-presenter.js'
import { businessNameSchema } from '../../schemas/business/business-name-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: async (request, h) => {
    const businessNameChange = await fetchBusinessNameChangeService(request.yar)
    const pageData = businessNameChangePresenter(businessNameChange, request.yar)

    return h.view('business/business-name-change.njk', pageData)
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
        const businessNameChange = await fetchBusinessNameChangeService(request.yar)
        const pageData = businessNameChangePresenter(businessNameChange, request.yar)

        return h.view('business/business-name-change.njk', {
          errors, ...pageData
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      await fetchBusinessNameChangeService(request.yar)
      setSessionData(request.yar, 'businessDetails', 'changeBusinessName', request.payload.businessName)

      return h.redirect('/business-name-check')
    }
  }
}

export const businessNameChangeRoutes = [
  getBusinessNameChange,
  postBusinessNameChange
]

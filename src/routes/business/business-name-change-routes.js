import { businessNameSchema } from '../../schemas/business/business-name-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessNameChangePresenter } from '../../presenters/business/business-name-change-presenter.js'
import { fetchBusinessNameService } from '../../services/business/fetch-business-name-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getBusinessNameChange = {
  method: 'GET',
  path: '/business-name-change',
  handler: async (request, h) => {
    const data = await fetchBusinessNameService()

    request.yar.set('businessNameChangeData', data)

    const pageData = businessNameChangePresenter(data)

    return h.view('business/business-name-change', pageData)
  }
}

const postBusinessNameChange = {
  method: 'POST',
  path: '/business-name-change',
  options: {
    validate: {
      payload: businessNameSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details ?? [])
        const sessionData = request.yar.get('businessNameChangeData')
        const pageData = businessNameChangePresenter(sessionData, request.payload)

        return h.view('business/business-name-change', {...pageData, errors}).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      setSessionData(request.yar, 'businessNameChangeData', 'businessName', request.payload)

      return h.redirect('/business-name-check')
    }
  }
}

export const businessNameChangeRoutes = [
  getBusinessNameChange,
  postBusinessNameChange
]

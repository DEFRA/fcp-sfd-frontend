import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessEmailChangePresenter } from '../../presenters/business/business-email-change-presenter.js'
import { businessEmailSchema } from '../../schemas/business/business-email-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessEmailChange = {
  method: 'GET',
  path: '/business-email-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessEmail')
    const pageData = businessEmailChangePresenter(businessDetails)

    return h.view('business/business-email-change', pageData)
  }
}

const postBusinessEmailChange = {
  method: 'POST',
  path: '/business-email-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    validate: {
      payload: businessEmailSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessEmail')
        const pageData = businessEmailChangePresenter(businessDetails, payload.businessEmail)

        return h.view('business/business-email-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      setSessionData(request.yar, 'businessDetails', 'changeBusinessEmail', request.payload.businessEmail)

      return h.redirect('/business-email-check')
    }
  }
}

export const businessEmailChangeRoutes = [
  getBusinessEmailChange,
  postBusinessEmailChange
]

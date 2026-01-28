import { businessPhoneSchema } from '../../schemas/business/business-phone-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessPhoneNumbersChangePresenter } from '../../presenters/business/business-phone-numbers-change-presenter.js'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers')
    const pageData = businessPhoneNumbersChangePresenter(businessDetails)

    return h.view('business/business-phone-numbers-change', pageData)
  }
}

const postBusinessPhoneNumbersChange = {
  method: 'POST',
  path: '/business-phone-numbers-change',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    validate: {
      payload: businessPhoneSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers')
        const pageData = businessPhoneNumbersChangePresenter(businessDetails, payload)

        return h.view('business/business-phone-numbers-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      // If a user didn't enter either of the numbers default its value to null
      request.payload = {
        businessTelephone: request.payload.businessTelephone ?? null,
        businessMobile: request.payload.businessMobile ?? null
      }

      setSessionData(request.yar, 'businessDetailsUpdate', 'changeBusinessPhoneNumbers', request.payload)

      return h.redirect('/business-phone-numbers-check')
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumbersChange,
  postBusinessPhoneNumbersChange
]

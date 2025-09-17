import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessVatChangePresenter } from '../../presenters/business/business-vat-change-presenter.js'
import { businessVatSchema } from '../../schemas/business/business-vat-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getBusinessVatChange = {
  method: 'GET',
  path: '/business-vat-registration-number-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVAT')
    const pageData = businessVatChangePresenter(businessDetails)

    return h.view('business/business-vat-registration-number-change', pageData)
  }
}

const postBusinessVatChange = {
  method: 'POST',
  path: '/business-vat-registration-number-change',
  options: {
    validate: {
      payload: businessVatSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVAT')
        const pageData = businessVatChangePresenter(businessDetails, payload.vatNumber)

        return h.view('business/business-vat-registration-number-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      setSessionData(request.yar, 'businessDetails', 'changeBusinessVAT', request.payload.vatNumber)

      return h.redirect('/business-vat-registration-number-check')
    }
  }
}

export const businessVatChangeRoutes = [
  getBusinessVatChange,
  postBusinessVatChange
]

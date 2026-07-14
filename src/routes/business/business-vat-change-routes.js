import { utils, constants, schemas } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessVatChangePresenter } from '../../presenters/business/business-vat-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessVatChange = {
  method: 'GET',
  path: '/business-vat-registration-number-change',
  options: {
    auth: { scope: FULL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat')
    const pageData = businessVatChangePresenter(businessDetails)

    return h.view('business/business-vat-registration-number-change', pageData)
  }
}

const postBusinessVatChange = {
  method: 'POST',
  path: '/business-vat-registration-number-change',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    validate: {
      payload: schemas.business.details.vat,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = utils.formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat')
        const pageData = businessVatChangePresenter(businessDetails, payload.vatNumber)

        return h.view('business/business-vat-registration-number-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      setSessionData(request.yar, 'businessDetailsUpdate', 'changeBusinessVat', request.payload.vatNumber)

      return h.redirect('/business-vat-registration-number-check')
    }
  }
}

export const businessVatChangeRoutes = [
  getBusinessVatChange,
  postBusinessVatChange
]

import { utils, constants, schemas } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessCharityRegistrationNumberChangePresenter } from '../../presenters/business/business-charity-registration-number-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessCharityRegistrationNumberChange = {
  method: 'GET',
  path: '/business-charity-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessLegalStatusCode = String(yar.get('businessLegalStatusCode') ?? '')

    if (!constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(businessLegalStatusCode)) {
      return h.redirect('/business-details')
    }

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCharityRegistrationNumber')
    const pageData = businessCharityRegistrationNumberChangePresenter(businessDetails)

    return h.view('business/business-charity-registration-number-change', pageData)
  }
}

const postBusinessCharityRegistrationNumberChange = {
  method: 'POST',
  path: '/business-charity-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    validate: {
      payload: schemas.business.legalStatusRegistration.charity,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = utils.formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCharityRegistrationNumber')
        const pageData = businessCharityRegistrationNumberChangePresenter(businessDetails, payload.charityCommissionRegistrationNumber)

        return h.view('business/business-charity-registration-number-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const { yar, payload } = request
      const businessLegalStatusCode = String(yar.get('businessLegalStatusCode') ?? '')

      if (!constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(businessLegalStatusCode)) {
        return h.redirect('/business-details')
      }

      setSessionData(yar, 'businessDetailsUpdate', 'changeBusinessCharityRegistrationNumber', payload.charityCommissionRegistrationNumber)

      return h.redirect('/business-charity-registration-number-check')
    }
  }
}

export const businessCharityRegistrationNumberChangeRoutes = [
  getBusinessCharityRegistrationNumberChange,
  postBusinessCharityRegistrationNumberChange
]

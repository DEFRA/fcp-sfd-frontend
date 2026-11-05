import { utils, constants, schemas } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessCompanyRegistrationNumberChangePresenter } from '../../presenters/business/business-company-registration-number-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { checkLegalStatusGuard } from '../pre-handlers.js'

const legalStatusGuard = checkLegalStatusGuard(constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES)

const getBusinessCompanyRegistrationNumberChange = {
  method: 'GET',
  path: '/business-company-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [legalStatusGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCompanyRegistrationNumber')
    const pageData = businessCompanyRegistrationNumberChangePresenter(businessDetails)

    return h.view('business/business-company-registration-number-change', pageData)
  }
}

const postBusinessCompanyRegistrationNumberChange = {
  method: 'POST',
  path: '/business-company-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [legalStatusGuard],
    validate: {
      payload: schemas.business.legalStatusRegistration.company,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = utils.formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCompanyRegistrationNumber')
        const pageData = businessCompanyRegistrationNumberChangePresenter(businessDetails, payload.companyRegistrationNumber)

        return h.view('business/business-company-registration-number-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const { yar, payload } = request

      setSessionData(yar, 'businessDetailsUpdate', 'changeBusinessCompanyRegistrationNumber', payload.companyRegistrationNumber)

      return h.redirect('/business-company-registration-number-check')
    }
  }
}

export const businessCompanyRegistrationNumberChangeRoutes = [
  getBusinessCompanyRegistrationNumberChange,
  postBusinessCompanyRegistrationNumberChange
]

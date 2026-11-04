import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessCompanyRegistrationNumberChangeService } from '../../services/business/update-business-company-registration-number-change-service.js'
import { businessCompanyRegistrationNumberCheckPresenter } from '../../presenters/business/business-company-registration-number-check-presenter.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_JOURNEY } from '../../constants/journeys.js'
import { constants } from '@defra/fcp-sfd-frontend-engine'
import { checkLegalStatusGuard, checkSessionDataGuard } from '../pre-handlers.js'

const legalStatusGuard = checkLegalStatusGuard(constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES)

const getBusinessCompanyRegistrationNumberCheck = {
  method: 'GET',
  path: '/business-company-registration-number-check',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCompanyRegistrationNumber'), legalStatusGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCompanyRegistrationNumber')
    const pageData = businessCompanyRegistrationNumberCheckPresenter(businessDetails)

    return h.view('business/business-company-registration-number-check', pageData)
  }
}

const postBusinessCompanyRegistrationNumberCheck = {
  method: 'POST',
  path: '/business-company-registration-number-check',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCompanyRegistrationNumber'), legalStatusGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updateBusinessCompanyRegistrationNumberChangeService(yar, auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessCompanyRegistrationNumberCheckRoutes = [
  getBusinessCompanyRegistrationNumberCheck,
  postBusinessCompanyRegistrationNumberCheck
]

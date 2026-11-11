import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessCompanyRegistrationNumberChangeService } from '../../services/business/update-business-company-registration-number-change-service.js'
import { businessCompanyRegistrationNumberCheckPresenter } from '../../presenters/business/business-company-registration-number-check-presenter.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_JOURNEY } from '../../constants/journeys.js'
import { constants } from '@defra/fcp-sfd-frontend-engine'
import { checkSessionDataGuard } from '../pre-handlers.js'

const BUSINESS_DETAILS_PATH = '/business-details'

const getBusinessCompanyRegistrationNumberCheck = {
  method: 'GET',
  path: '/business-company-registration-number-check',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCompanyRegistrationNumber')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessLegalStatusCode = String(yar.get('businessLegalStatusCode') ?? '')

    if (!constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES.includes(businessLegalStatusCode)) {
      return h.redirect(BUSINESS_DETAILS_PATH)
    }

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCompanyRegistrationNumber')
    const pageData = businessCompanyRegistrationNumberCheckPresenter(businessDetails)

    return h.view('business/business-company-registration-number-check', pageData)
  }
}

const postBusinessCompanyRegistrationNumberCheck = {
  method: 'POST',
  path: '/business-company-registration-number-check',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCompanyRegistrationNumber')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessLegalStatusCode = String(yar.get('businessLegalStatusCode') ?? '')

    if (!constants.business.COMPANY_REGISTRATION_LEGAL_STATUS_CODES.includes(businessLegalStatusCode)) {
      return h.redirect(BUSINESS_DETAILS_PATH)
    }

    await updateBusinessCompanyRegistrationNumberChangeService(yar, auth.credentials)

    return h.redirect(BUSINESS_DETAILS_PATH)
  }
}

export const businessCompanyRegistrationNumberCheckRoutes = [
  getBusinessCompanyRegistrationNumberCheck,
  postBusinessCompanyRegistrationNumberCheck
]

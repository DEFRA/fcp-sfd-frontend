import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessCharityRegistrationNumberChangeService } from '../../services/business/update-business-charity-registration-number-change-service.js'
import { businessCharityRegistrationNumberCheckPresenter } from '../../presenters/business/business-charity-registration-number-check-presenter.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_JOURNEY } from '../../constants/journeys.js'
import { constants } from '@defra/fcp-sfd-frontend-engine'
import { checkSessionDataGuard } from '../pre-handlers.js'

const getBusinessCharityRegistrationNumberCheck = {
  method: 'GET',
  path: '/business-charity-registration-number-check',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCharityRegistrationNumber')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessLegalStatusCode = String(yar.get('businessLegalStatusCode') ?? '')

    if (!constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(businessLegalStatusCode)) {
      return h.redirect('/business-details')
    }

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCharityRegistrationNumber')
    const pageData = businessCharityRegistrationNumberCheckPresenter(businessDetails)

    return h.view('business/business-charity-registration-number-check', pageData)
  }
}

const postBusinessCharityRegistrationNumberCheck = {
  method: 'POST',
  path: '/business-charity-registration-number-check',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCharityRegistrationNumber')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessLegalStatusCode = String(yar.get('businessLegalStatusCode') ?? '')

    if (!constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(businessLegalStatusCode)) {
      return h.redirect('/business-details')
    }

    await updateBusinessCharityRegistrationNumberChangeService(yar, auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessCharityRegistrationNumberCheckRoutes = [
  getBusinessCharityRegistrationNumberCheck,
  postBusinessCharityRegistrationNumberCheck
]

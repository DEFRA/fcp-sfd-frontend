import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessCharityRegistrationNumberChangeService } from '../../services/business/update-business-charity-registration-number-change-service.js'
import { businessCharityRegistrationNumberCheckPresenter } from '../../presenters/business/business-charity-registration-number-check-presenter.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_JOURNEY } from '../../constants/journeys.js'
import { constants } from '@defra/fcp-sfd-frontend-engine'
import { checkLegalStatusGuard, checkSessionDataGuard } from '../pre-handlers.js'

const legalStatusGuard = checkLegalStatusGuard(constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES)

const getBusinessCharityRegistrationNumberCheck = {
  method: 'GET',
  path: '/business-charity-registration-number-check',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCharityRegistrationNumber'), legalStatusGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessCharityRegistrationNumber')
    const pageData = businessCharityRegistrationNumberCheckPresenter(businessDetails)

    return h.view('business/business-charity-registration-number-check', pageData)
  }
}

const postBusinessCharityRegistrationNumberCheck = {
  method: 'POST',
  path: '/business-charity-registration-number-check',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessCharityRegistrationNumber'), legalStatusGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updateBusinessCharityRegistrationNumberChangeService(yar, auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessCharityRegistrationNumberCheckRoutes = [
  getBusinessCharityRegistrationNumberCheck,
  postBusinessCharityRegistrationNumberCheck
]

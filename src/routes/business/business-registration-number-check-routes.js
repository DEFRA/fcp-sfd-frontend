import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessRegistrationNumberChangeService } from '../../services/business/update-business-registration-number-change-service.js'
import { businessRegistrationNumberCheckPresenter } from '../../presenters/business/business-registration-number-check-presenter.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS } from '../../constants/business-registration-number-session-fields.js'
import { checkRegistrationNumberSessionGuard } from '../pre-handlers.js'

const getBusinessRegistrationNumberCheck = {
  method: 'GET',
  path: '/business-registration-number-check',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [checkRegistrationNumberSessionGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS)
    const pageData = businessRegistrationNumberCheckPresenter(businessDetails)

    return h.view('business/business-registration-number-check', pageData)
  }
}

const postBusinessRegistrationNumberCheck = {
  method: 'POST',
  path: '/business-registration-number-check',
  options: {
    auth: { scope: LEGAL_PERMISSIONS },
    pre: [checkRegistrationNumberSessionGuard]
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    await updateBusinessRegistrationNumberChangeService(yar, auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessRegistrationNumberCheckRoutes = [
  getBusinessRegistrationNumberCheck,
  postBusinessRegistrationNumberCheck
]

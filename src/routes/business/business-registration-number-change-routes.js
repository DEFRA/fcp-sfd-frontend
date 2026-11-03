import { utils, constants } from '@defra/fcp-sfd-frontend-engine'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { validateBusinessRegistrationNumberService } from '../../services/business/validate-business-registration-number-service.js'
import { businessRegistrationNumberChangePresenter } from '../../presenters/business/business-registration-number-change-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { LEGAL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS } from '../../constants/business-registration-number-session-fields.js'

const getBusinessRegistrationNumberChange = {
  method: 'GET',
  path: '/business-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS)
    const pageData = businessRegistrationNumberChangePresenter(businessDetails)

    return h.view('business/business-registration-number-change', pageData)
  }
}

const postBusinessRegistrationNumberChange = {
  method: 'POST',
  path: '/business-registration-number-change',
  options: {
    auth: { scope: LEGAL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, BUSINESS_REGISTRATION_NUMBER_SESSION_FIELDS)
    const { error, value, payloadField, sessionField } = validateBusinessRegistrationNumberService(businessDetails.legalStatusCode, payload)

    if (error) {
      const errors = utils.formatValidationErrors(error.details)
      const pageData = businessRegistrationNumberChangePresenter(businessDetails, payload)

      return h.view('business/business-registration-number-change', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST)
    }

    setSessionData(yar, 'businessDetailsUpdate', sessionField, value[payloadField])

    return h.redirect('/business-registration-number-check')
  }
}

export const businessRegistrationNumberChangeRoutes = [
  getBusinessRegistrationNumberChange,
  postBusinessRegistrationNumberChange
]

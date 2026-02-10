import { businessPhoneNumbersCheckPresenter } from '../../presenters/business/business-phone-numbers-check-presenter.js'
import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessPhoneNumbersChangeService } from '../../services/business/update-business-phone-numbers-change-service.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'
import { createLogger } from '../../utils/logger.js'

const logger = createLogger()

const getBusinessPhoneNumbersCheck = {
  method: 'GET',
  path: '/business-phone-numbers-check',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPhoneNumbers')
    const pageData = businessPhoneNumbersCheckPresenter(businessDetails)

    return h.view('business/business-phone-numbers-check', pageData)
  }
}

const postBusinessPhoneNumbersCheck = {
  method: 'POST',
  path: '/business-phone-numbers-check',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request

    logger.info('Updating business phone numbers')

    try {
      await updateBusinessPhoneNumbersChangeService(yar, auth.credentials)
    } catch (error) {
      logger.error(error, 'Failed to update business phone numbers')
      throw error
    }

    logger.info('Business phone numbers updated successfully')

    return h.redirect('/business-details')
  }
}

export const businessPhoneNumbersCheckRoutes = [
  getBusinessPhoneNumbersCheck,
  postBusinessPhoneNumbersCheck
]

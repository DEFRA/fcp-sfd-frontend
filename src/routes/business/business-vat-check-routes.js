import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessVatChangeService } from '../../services/business/update-business-vat-change-service.js'
import { businessVatCheckPresenter } from '../../presenters/business/business-vat-check-presenter.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'
import { BUSINESS_JOURNEY } from '../../constants/journeys.js'
import { checkSessionDataGuard } from '../pre-handlers.js'

const getBusinessVatCheck = {
  method: 'GET',
  path: '/business-vat-registration-number-check',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessVat')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVat')

    const pageData = businessVatCheckPresenter(businessDetails)

    return h.view('business/business-vat-registration-number-check', pageData)
  }
}

const postBusinessVatCheck = {
  method: 'POST',
  path: '/business-vat-registration-number-check',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    pre: [checkSessionDataGuard(BUSINESS_JOURNEY, 'changeBusinessVat')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updateBusinessVatChangeService(yar, auth.credentials)

    return h.redirect('/business-details')
  }
}

export const businessVatCheckRoutes = [
  getBusinessVatCheck,
  postBusinessVatCheck
]

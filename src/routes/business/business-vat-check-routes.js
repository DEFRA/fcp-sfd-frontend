import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { updateBusinessVatChangeService } from '../../services/business/update-business-vat-change-service.js'
import { businessVatCheckPresenter } from '../../presenters/business/business-vat-check-presenter.js'

const getBusinessVatCheck = {
  method: 'GET',
  path: '/business-vat-registration-number-check',
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessVAT')
    const pageData = businessVatCheckPresenter(businessDetails)

    return h.view('business/business-vat-registration-number-check', pageData)
  }
}

const postBusinessVatCheck = {
  method: 'POST',
  path: '/business-vat-registration-number-check',
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

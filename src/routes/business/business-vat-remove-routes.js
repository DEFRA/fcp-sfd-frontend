import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { updateBusinessVatRemoveService } from '../../services/business/update-business-vat-remove-service.js'
import { businessVatRemovePresenter } from '../../presenters/business/business-vat-remove-presenter.js'

const getBusinessVatRemove = {
  method: 'GET',
  path: '/business-VAT-registration-remove',
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.yar, request.auth.credentials)
    const pageData = businessVatRemovePresenter(businessDetails)
    return h.view('business/business-VAT-registration-remove', pageData)
  }
}

const postBusinessVatRemove = {
  method: 'POST',
  path: '/business-VAT-registration-remove',
  handler: async (request, h) => {
    await updateBusinessVatRemoveService(request.yar, request.auth.credentials)
    return h.redirect('/business-details')
  }
}

export const businessVatRemoveRoutes = [
  getBusinessVatRemove,
  postBusinessVatRemove
]

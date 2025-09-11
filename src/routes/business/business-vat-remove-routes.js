import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { updateBusinessVatRemoveService } from '../../services/business/update-business-vat-remove-service.js'
import { businessVatRemovePresenter } from '../../presenters/business/business-vat-remove-presenter.js'
import { businessVatRemoveSchema } from '../../schemas/business/business-vat-remove-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'

const getBusinessVatRemove = {
  method: 'GET',
  path: '/business-vat-registration-remove',
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.yar, request.auth.credentials)
    const pageData = businessVatRemovePresenter(businessDetails)
    return h.view('business/business-vat-registration-remove', pageData)
  }
}

const postBusinessVatRemove = {
  method: 'POST',
  path: '/business-vat-registration-remove',
  options: {
    validate: {
      payload: businessVatRemoveSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])
        const businessDetailsData = request.yar.get('businessDetails')
        const pageData = businessVatRemovePresenter(businessDetailsData)

        return h.view('business/business-vat-registration-remove', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const { confirmRemove } = request.payload

      if (confirmRemove === 'yes') {
        await updateBusinessVatRemoveService(request.yar, request.auth.credentials)
        return h.redirect('/business-details')
      }

      return h.redirect('/business-details')
    }
  }
}

export const businessVatRemoveRoutes = [
  getBusinessVatRemove,
  postBusinessVatRemove
]

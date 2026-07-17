import { utils, constants, schemas } from '@defra/fcp-sfd-frontend-engine'

import { fetchBusinessDetailsService } from '../../services/business/fetch-business-details-service.js'
import { updateBusinessVatRemoveService } from '../../services/business/update-business-vat-remove-service.js'
import { businessVatRemovePresenter } from '../../presenters/business/business-vat-remove-presenter.js'
import { FULL_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessVatRemove = {
  method: 'GET',
  path: '/business-vat-registration-remove',
  options: {
    auth: { scope: FULL_PERMISSIONS }
  },
  handler: async (request, h) => {
    const businessDetails = await fetchBusinessDetailsService(request.auth.credentials)
    const pageData = businessVatRemovePresenter(businessDetails)

    return h.view('business/business-vat-registration-remove', pageData)
  }
}

const postBusinessVatRemove = {
  method: 'POST',
  path: '/business-vat-registration-remove',
  options: {
    auth: { scope: FULL_PERMISSIONS },
    validate: {
      payload: schemas.business.vat.remove,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const errors = utils.formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessDetailsService(request.auth.credentials)
        const pageData = businessVatRemovePresenter(businessDetails)

        return h.view('business/business-vat-registration-remove', { ...pageData, errors }).code(constants.statusCodes.BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      if (request.payload.confirmRemove === 'yes') {
        await updateBusinessVatRemoveService(request.yar, request.auth.credentials)
      }

      return h.redirect('/business-details')
    }
  }
}

export const businessVatRemoveRoutes = [
  getBusinessVatRemove,
  postBusinessVatRemove
]

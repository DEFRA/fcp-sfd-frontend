import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { addressSchema } from '../../schemas/address-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessAddressEnterPresenter } from '../../presenters/business/business-address-enter-presenter.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { AMEND_PERMISSIONS } from '../../constants/scope/business-details.js'

const getBusinessAddressEnter = {
  method: 'GET',
  path: '/business-address-enter',
  options: {
    auth: { scope: AMEND_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessAddress')
    const pageData = businessAddressEnterPresenter(businessDetails)

    return h.view('business/business-address-enter', pageData)
  }
}

const postBusinessAddressEnter = {
  method: 'POST',
  path: '/business-address-enter',
  options: {
    auth: { scope: AMEND_PERMISSIONS },
    validate: {
      payload: addressSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessAddress')
        const pageData = businessAddressEnterPresenter(businessDetails, payload)

        return h.view('business/business-address-enter', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      setSessionData(request.yar, 'businessDetailsUpdate', 'changeBusinessAddress', request.payload)

      return h.redirect('/business-address-check')
    }
  }
}

export const businessAddressEnterRoutes = [
  getBusinessAddressEnter,
  postBusinessAddressEnter
]

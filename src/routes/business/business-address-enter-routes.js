import { businessAddressSchema } from '../../schemas/business/business-address-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessAddressEnterPresenter } from '../../presenters/business/business-address-enter-presenter.js'
import { fetchBusinessAddressService } from '../../services/business/fetch-business-address-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getBusinessAddressEnter = {
  method: 'GET',
  path: '/business-address-enter',
  handler: async (request, h) => {
    const data = await fetchBusinessAddressService()

    request.yar.set('businessAddressEnterData', data)

    const pageData = businessAddressEnterPresenter(data)

    return h.view('business/business-address-enter', pageData)
  }
}

const postBusinessAddressEnter = {
  method: 'POST',
  path: '/business-address-enter',
  options: {
    pre: [{
      method: (request, h) => {
        const { yar, payload, pre } = request

        pre.sessionData = setSessionData(payload, yar, 'businessAddressEnterData', 'businessAddress')

        return h.continue
      }
    }],
    validate: {
      payload: businessAddressSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details ?? [])
        const pageData = businessAddressEnterPresenter(request.pre.sessionData)

        return h.view('business/business-address-enter', { pageData, ...errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (_request, h) => {
      return h.redirect('/business-address-check')
    }
  }
}

export const businessAddressRoutes = [
  getBusinessAddressEnter,
  postBusinessAddressEnter
]

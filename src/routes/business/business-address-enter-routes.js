import { businessAddressSchema } from '../../schemas/business/business-address-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessAddressEnterPresenter } from '../../presenters/business/business-address-enter-presenter.js'
import { fetchUpdatedBusinessDataService } from '../../services/business/fetch-updated-business-data-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'


const getBusinessAddressEnter = {
  method: 'GET',
  path: '/business-address-enter',
  handler: async (request, h) => {
    const businessAddressEnterData = await fetchUpdatedBusinessDataService(request.yar, 'businessAddress')
    // const businessDetailsData = request.yar.get('businessDetails')

    // Retrieve the previously entered address in case the user has gone back to amend it.
    // This allows us to pre-populate the form with their previous input.
    // const payloadAddress = request.yar.get('businessAddress')
    const pageData = businessAddressEnterPresenter(businessAddressEnterData)

    return h.view('business/business-address-enter', pageData)
  }
}

const postBusinessAddressEnter = {
  method: 'POST',
  path: '/business-address-enter',
  options: {
    validate: {
      payload: businessAddressSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])
        const businessDetailsData = request.yar.get('businessDetails')
        const pageData = businessAddressEnterPresenter(businessDetailsData, request.payload)

        return h.view('business/business-address-enter', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      setSessionData(request.yar, 'businessDetails', 'changeBusinessAddress', request.payload)

      // request.yar.set('businessAddress', request.payload)

      return h.redirect('/business-address-check')
    }
  }
}

export const businessAddressRoutes = [
  getBusinessAddressEnter,
  postBusinessAddressEnter
]

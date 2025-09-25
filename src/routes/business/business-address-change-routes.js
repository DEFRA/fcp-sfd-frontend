import { fetchBusinessChangeService } from '../../services/business/fetch-business-change-service.js'
import { businessUkPostcodeSchema } from '../../schemas/business/business-uk-postcode-schema.js'
import { businessAddressChangePresenter } from "../../presenters/business/business-address-change-presenter.js"
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'
import { addressLookupService } from '../../services/address-lookup/address-lookup-service.js'
import { businessAddressChangeErrorService } from '../../services/business/business-address-change-error-service.js'

const getBusinessAddressChange = {
  method: 'GET',
  path: '/business-address-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const businessDetails = await fetchBusinessChangeService(yar, auth.credentials, 'changeBusinessPostcode')
    const pageData = businessAddressChangePresenter(businessDetails)

    return h.view('business/business-address-change', pageData)
  }
}

const postBusinessAddressChange = {
  method: 'POST',
  path: '/business-address-change',
  options: {
    validate: {
      payload: businessUkPostcodeSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request
        const pageData = await businessAddressChangeErrorService(yar, auth.credentials, payload.businessPostcode, err.details)

        return h.view('business/business-address-change', pageData).code(BAD_REQUEST).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const { yar, auth, payload } = request

    setSessionData(yar, 'businessDetails', 'changeBusinessPostcode', payload)

    const addresses = await addressLookupService(payload.businessPostcode, yar)

    // Happy path
    if (addresses.length !== 0) {
      return h.redirect('/business-address-select-change')
    }

    // Unhappy path
    const error = [
      {
        message: 'No addresses found for this postcode',
        path: ['businessPostcode']
      }
    ]
    const pageData = await businessAddressChangeErrorService(yar, auth.credentials, payload.businessPostcode, error)

    return h.view('business/business-address-change', pageData).code(BAD_REQUEST).takeover()
  }
}

export const businessAddressChangeRoutes = [
  getBusinessAddressChange,
  postBusinessAddressChange
]

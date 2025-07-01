import { fetchBusinessPhoneNumbersChangeService } from '../../services/business/fetch-business-phone-numbers-change-service.js'
import { businessPhoneNumbersChangePresenter } from '../../presenters/business/business-phone-numbers-change-presenter.js'
import { businessPhoneSchema } from '../../schemas/business/business-phone-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  handler: async (request, h) => {
    const businessPhonesChange = await fetchBusinessPhoneNumbersChangeService(request.yar)
    const pageData = businessPhoneNumbersChangePresenter(businessPhonesChange, request.yar)

    return h.view('business/business-phone-numbers-change.njk', pageData)
  }
}

const postBusinessPhoneNumbersChange = {
  method: 'POST',
  path: '/business-phone-numbers-change',
  options: {
    validate: {
      payload: businessPhoneSchema,
      options: {
        abortEarly: false
      },
      failAction: async (request, h, err) => {
        const errors = formatValidationErrors(err.details || [])
        const businessPhoneNumbersChange = await fetchBusinessPhoneNumbersChangeService(request.yar)
        const pageData = businessPhoneNumbersChangePresenter(businessPhoneNumbersChange)

        return h.view('business/business-phone-numbers-change.njk', {
          errors, ...pageData
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      await fetchBusinessPhoneNumbersChangeService(request.yar)
      setSessionData(request.yar, 'businessDetails', 'changeBusinessPhones',
        { telephone: request.payload.businessTelephone, mobile: request.payload.businessMobile })

      return h.redirect('/business-phone-numbers-check')
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumbersChange,
  postBusinessPhoneNumbersChange
]

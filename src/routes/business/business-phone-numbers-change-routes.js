import { businessPhoneSchema } from '../../schemas/business/business-phone-schema.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessPhoneNumberPresenter } from '../../presenters/business/business-phone-numbers-presenter.js'
import { fetchBusinessPhoneNumbersService } from '../../services/business/fetch-business-phone-numbers-service.js'
import { setBusinessPhoneNumberService } from '../../services/business/set-business-phone-numbers-service.js'

const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  handler: async (request, h) => {
    const businessPhoneChange = await fetchBusinessPhoneNumbersService(request.yar)
    const pageData = businessPhoneNumberPresenter(businessPhoneChange)

    return h.view('business/business-phone-numbers-change', pageData)
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

        return h.view('business/business-phone-numbers-change', {
          businessTelephone: request.payload?.businessTelephone || '',
          businessMobile: request.payload?.businessMobile || '',
          errors
        }).code(BAD_REQUEST).takeover()
      }
    },
    handler: async (request, h) => {
      const { businessTelephone, businessMobile } = request.payload
      await setBusinessPhoneNumberService({ businessMobile, businessTelephone }, request.yar)

      return h.redirect('/business-phone-numbers-check')
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumbersChange,
  postBusinessPhoneNumbersChange
]

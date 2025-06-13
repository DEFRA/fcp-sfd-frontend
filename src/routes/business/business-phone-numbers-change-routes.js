import { businessPhoneSchema } from '../../schemas/business/business-phone-schema.js'
import { formatValidationErrors } from '../../utils/validation-error-handler.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { businessPhoneNumberPresenter } from '../../presenters/business/business-phone-numbers-presenter.js'
import { fetchBusinessPhoneNumbersService } from './fetch-business-phone-numbers-service.js'

const getBusinessPhoneNumbersChange = {
  method: 'GET',
  path: '/business-phone-numbers-change',
  handler: (request, h) => {
    const data = fetchBusinessPhoneNumbersService()
    const pageData = businessPhoneNumberPresenter(data, request.yar)

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
    handler: (request, h) => {
      const { businessTelephone, businessMobile } = request.payload

      return h.redirect('/business-phone-numbers-check')
        .state('tempBusinessTelephone', businessTelephone)
        .state('tempBusinessMobile', businessMobile)
    }
  }
}

export const businessPhoneNumbersChangeRoutes = [
  getBusinessPhoneNumbersChange,
  postBusinessPhoneNumbersChange
]

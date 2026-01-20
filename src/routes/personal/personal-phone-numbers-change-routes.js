import { personalPhoneSchema } from '../../schemas/personal/personal-phone-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { personalPhoneNumbersChangePresenter } from '../../presenters/personal/personal-phone-numbers-change-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalPhoneNumbersChange = {
  method: 'GET',
  path: '/account-phone-numbers-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers')
    const pageData = personalPhoneNumbersChangePresenter(personalDetails)

    return h.view('personal/personal-phone-numbers-change', pageData)
  }
}

const postPersonalPhoneNumbersChange = {
  method: 'POST',
  path: '/account-phone-numbers-change',
  options: {
    validate: {
      payload: personalPhoneSchema,
      options: { abortEarly: false },
      failAction: async (request, h, err) => {
        const { yar, auth, payload } = request

        const errors = formatValidationErrors(err.details || [])
        const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers')
        const pageData = personalPhoneNumbersChangePresenter(personalDetails, payload)

        return h.view('personal/personal-phone-numbers-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      // If a user didn't enter either of the numbers default its value to null
      request.payload = {
        personalTelephone: request.payload.personalTelephone ?? null,
        personalMobile: request.payload.personalMobile ?? null
      }

      setSessionData(request.yar, 'personalDetailsUpdate', 'changePersonalPhoneNumbers', request.payload)

      return h.redirect('/account-phone-numbers-check')
    }
  }
}

export const personalPhoneNumbersChangeRoutes = [
  getPersonalPhoneNumbersChange,
  postPersonalPhoneNumbersChange
]

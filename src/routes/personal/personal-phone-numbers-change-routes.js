import { personalPhoneSchema } from '../../schemas/personal/personal-phone-schema.js'
import { formatValidationErrors } from '../../utils/format-validation-errors.js'
import { BAD_REQUEST } from '../../constants/status-codes.js'
import { personalPhoneNumbersChangePresenter } from '../../presenters/personal/personal-phone-numbers-change-presenter.js'
import { fetchPersonalDetailsService } from '../../services/personal/fetch-personal-details-service.js'
import { setSessionData } from '../../utils/session/set-session-data.js'

const getPersonalPhoneNumbersChange = {
  method: 'GET',
  path: '/account-phone-numbers-change',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalDetailsService(yar, auth.credentials)
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
        const errors = formatValidationErrors(err.details || [])
        const personalDetailsData = request.yar.get('personalDetails')
        const pageData = personalPhoneNumbersChangePresenter(personalDetailsData, request.payload)

        return h.view('personal/personal-phone-numbers-change', { ...pageData, errors }).code(BAD_REQUEST).takeover()
      }
    },
    handler: (request, h) => {
      setSessionData(request.yar, 'personalDetails', 'changePersonalTelephone', request.payload.personalTelephone ?? null)
      setSessionData(request.yar, 'personalDetails', 'changePersonalMobile', request.payload.personalMobile ?? null)

      return h.redirect('/account-phone-numbers-check')
    }
  }
}

export const personalPhoneNumbersChangeRoutes = [
  getPersonalPhoneNumbersChange,
  postPersonalPhoneNumbersChange
]

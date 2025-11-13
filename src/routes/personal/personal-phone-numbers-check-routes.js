import { personalPhoneNumbersCheckPresenter } from '../../presenters/personal/personal-phone-numbers-check-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { updatePersonalPhoneNumbersChangeService } from '../../services/personal/update-personal-phone-numbers-change-service.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'

const getPersonalPhoneNumbersCheck = {
  method: 'GET',
  path: '/account-phone-numbers-check',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalPhoneNumbers')
    const pageData = personalPhoneNumbersCheckPresenter(personalDetails)

    return h.view('personal/personal-phone-numbers-check', pageData)
  }
}

const postPersonalPhoneNumbersCheck = {
  method: 'POST',
  path: '/account-phone-numbers-check',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updatePersonalPhoneNumbersChangeService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalPhoneNumbersCheckRoutes = [
  getPersonalPhoneNumbersCheck,
  postPersonalPhoneNumbersCheck
]

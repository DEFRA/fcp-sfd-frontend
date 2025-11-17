import { personalAddressCheckPresenter } from '../../presenters/personal/personal-address-check-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { updatePersonalAddressChangeService } from '../../services/personal/update-personal-address-change-service.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'

const getPersonalAddressCheck = {
  method: 'GET',
  path: '/account-address-check',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalAddress')
    const pageData = personalAddressCheckPresenter(personalDetails)

    return h.view('personal/personal-address-check', pageData)
  }
}

const postPersonalAddressCheck = {
  method: 'POST',
  path: '/account-address-check',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updatePersonalAddressChangeService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalAddressCheckRoutes = [
  getPersonalAddressCheck,
  postPersonalAddressCheck
]

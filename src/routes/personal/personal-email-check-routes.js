import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { updatePersonalEmailChangeService } from '../../services/personal/update-personal-email-change-service.js'
import { personalEmailCheckPresenter } from '../../presenters/personal/personal-email-check-presenter.js'
import { VIEW_PERMISSIONS } from '../../constants/scope/business-details.js'

const getPersonalEmailCheck = {
  method: 'GET',
  path: '/account-email-check',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalEmail')
    const pageData = personalEmailCheckPresenter(personalDetails)

    return h.view('personal/personal-email-check', pageData)
  }
}

const postPersonalEmailCheck = {
  method: 'POST',
  path: '/account-email-check',
  options: {
    auth: { scope: VIEW_PERMISSIONS }
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updatePersonalEmailChangeService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalEmailCheckRoutes = [
  getPersonalEmailCheck,
  postPersonalEmailCheck
]

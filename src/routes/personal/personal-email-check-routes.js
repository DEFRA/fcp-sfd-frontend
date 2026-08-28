import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { updatePersonalEmailChangeService } from '../../services/personal/update-personal-email-change-service.js'
import { personalEmailCheckPresenter } from '../../presenters/personal/personal-email-check-presenter.js'
import { PERSONAL_JOURNEY } from '../../constants/journeys.js'
import { checkSessionDataGuard } from '../pre-handlers.js'

const getPersonalEmailCheck = {
  method: 'GET',
  path: '/account-email-check',
  options: {
    pre: [checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalEmail')]
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
    pre: [checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalEmail')]
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

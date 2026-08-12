import { personalDobCheckPresenter } from '../../presenters/personal/personal-dob-check-presenter.js'
import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { updatePersonalDobChangeService } from '../../services/personal/update-personal-dob-change-service.js'
import { PERSONAL_JOURNEY } from '../../constants/journeys.js'
import { checkSessionDataGuard } from '../pre-handlers.js'

const getPersonalDobCheck = {
  method: 'GET',
  path: '/account-date-of-birth-check',
  options: {
    pre: [checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalDob')

    const pageData = personalDobCheckPresenter(personalDetails)

    return h.view('personal/personal-dob-check', pageData)
  }
}

const postPersonalDobCheck = {
  method: 'POST',
  path: '/account-date-of-birth-check',
  options: {
    pre: [checkSessionDataGuard(PERSONAL_JOURNEY, 'changePersonalDob')]
  },
  handler: async (request, h) => {
    const { yar, auth } = request
    await updatePersonalDobChangeService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalDobCheckRoutes = [
  getPersonalDobCheck,
  postPersonalDobCheck
]

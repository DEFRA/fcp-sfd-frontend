import { fetchPersonalChangeService } from '../../services/personal/fetch-personal-change-service.js'
import { updatePersonalNameChangeService } from '../../services/personal/update-personal-name-change-service.js'
import { personalNameCheckPresenter } from '../../presenters/personal/personal-name-check-presenter.js'

const getPersonalNameCheck = {
  method: 'GET',
  path: '/account-name-check',
  handler: async (request, h) => {
    const { yar, auth } = request
    const personalDetails = await fetchPersonalChangeService(yar, auth.credentials, 'changePersonalName')
    const pageData = personalNameCheckPresenter(personalDetails)

    return h.view('personal/personal-name-check', pageData)
  }
}

const postPersonalNameCheck = {
  method: 'POST',
  path: '/account-name-check',
  handler: async (request, h) => {
    const { yar, auth } = request
    await updatePersonalNameChangeService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalNameCheckRoutes = [
  getPersonalNameCheck,
  postPersonalNameCheck
]

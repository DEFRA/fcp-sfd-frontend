import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'
import { personalFixCheckPresenter } from '../../presenters/personal/personal-fix-check-presenter.js'
import { updatePersonalFixService } from '../../services/personal/update-personal-fix-service.js'

const getPersonalFixCheck = {
  method: 'GET',
  path: '/personal-fix-check',
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get('personalDetailsValidation')
    const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
    const pageData = personalFixCheckPresenter(personalDetails)

    return h.view('personal/personal-fix-check.njk', pageData)
  }
}

const postPersonalFixCheck = {
  method: 'POST',
  path: '/personal-fix-check',
  handler: async (request, h) => {
    const { yar, auth } = request

    await updatePersonalFixService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalFixCheckRoutes = [
  getPersonalFixCheck,
  postPersonalFixCheck
]

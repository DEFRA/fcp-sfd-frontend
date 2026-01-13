import { fetchPersonalFixListService } from '../../services/personal/fetch-personal-fix-list-service.js'
import { personalFixCheckPresenter } from '../../presenters/personal/personal-fix-check-presenter.js'
import { updatePersonalFixCheckService } from '../../services/personal/update-personal-fix-check-service.js'

const getPersonalFixCheck = {
  method: 'GET',
  path: '/personal-fix-check',
  handler: async (request, h) => {
    const { yar, auth } = request

    const sessionData = yar.get(auth.credentials.sessionId)
    const personalDetails = await fetchPersonalFixListService(yar, auth.credentials)
    console.log('🚀 ~ personalDetails in route:', personalDetails)
    const pageData = personalFixCheckPresenter(personalDetails, sessionData)

    return h.view('personal/personal-fix-check.njk', pageData)

  }
}

const postPersonalFixCheck = {
  method: 'POST',
  path: '/personal-fix-check',
  handler: async (request, h) => {
    const { yar, auth } = request

    await updatePersonalFixCheckService(yar, auth.credentials)

    return h.redirect('/personal-details')
  }
}

export const personalFixCheckRoutes = [
  getPersonalFixCheck,
  postPersonalFixCheck
]

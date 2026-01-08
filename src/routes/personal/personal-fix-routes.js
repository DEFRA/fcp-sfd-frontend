import { personalFixPresenter } from '../../presenters/personal/personal-fix-presenter.js'
import { setPersonalFixListService } from '../../services/personal/set-personal-fix-list-service.js'

const getPersonalFix = {
  method: 'GET',
  path: '/personal-fix',
  handler: async (request, h) => {
    const { yar, auth, query } = request

    // Set the list of things to show on the session so we don't have to keep doing it
    const sessionData = setPersonalFixListService(yar, auth.credentials.sessionId, query.source)
    const pageData = personalFixPresenter(sessionData)

    return h.view('personal/personal-fix.njk', pageData)
  }
}

const postPersonalFix = {
  method: 'POST',
  path: '/personal-fix',
  handler: async (_request, h) => {
    return h.redirect('/personal-fix-list')
  }
}

export const personalFixRoutes = [
  getPersonalFix,
  postPersonalFix
]

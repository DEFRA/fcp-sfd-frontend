import { personalFixPresenter } from '../../presenters/personal/personal-fix-presenter.js'
import { initialiseFixJourneyService } from '../../services/initialise-fix-journey-service.js'

const getPersonalFix = {
  method: 'GET',
  path: '/personal-fix',
  handler: async (request, h) => {
    const { yar, query } = request

    const sessionData = initialiseFixJourneyService(yar, query.source, 'personal')
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

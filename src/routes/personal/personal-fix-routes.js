import { personalFixPresenter } from '../../presenters/personal/personal-fix-presenter.js'
import { fetchPersonalFixService } from '../../services/personal/fetch-personal-fix-service.js'

import { services } from '@defra/fcp-sfd-frontend-engine'

const getPersonalFix = {
  method: 'GET',
  path: '/personal-fix',
  handler: async (request, h) => {
    const { yar, query, auth } = request

    const sessionData = services.initialiseFixJourney(yar, query.source, 'personal')
    const personalDetails = await fetchPersonalFixService(auth.credentials, sessionData)
    const pageData = personalFixPresenter(personalDetails)

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

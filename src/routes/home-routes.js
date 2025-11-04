import { SCOPE } from '../constants/scope/business-details.js'
import { homePresenter } from '../presenters/home-presenter.js'
import { fetchPersonalBusinessDetailsService } from '../services/fetch-personal-business-details-service.js'

const index = {
  method: 'GET',
  path: '/',
  options: {
    auth: { mode: 'try' }
  },
  handler: (_request, h) => {
    return h.view('index')
  }
}

const home = {
  method: 'GET',
  path: '/home',
  options: {
    auth: { scope: SCOPE }
  },
  handler: async (request, h) => {
    const { auth } = request
    const homeData = await fetchPersonalBusinessDetailsService(auth.credentials)
    const pageData = homePresenter(homeData, auth.credentials.scope)

    return h.view('home', pageData)
  }
}

export const homeRoutes = [
  index,
  home
]

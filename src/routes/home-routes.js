import { SCOPE } from '../constants/scope/business-details.js'
import { homePresenter } from '../presenters/home-presenter.js'

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
  handler: (request, h) => {
    const pageData = homePresenter(request.auth)

    return h.view('home', pageData)
  }
}

export const homeRoutes = [
  index,
  home
]

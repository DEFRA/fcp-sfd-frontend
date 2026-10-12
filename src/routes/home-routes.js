import { homePresenter } from '../presenters/home-presenter.js'
import { fetchPersonalBusinessDetailsService } from '../services/fetch-personal-business-details-service.js'

const start = {
  method: 'GET',
  path: '/',
  options: {
    auth: { mode: 'try' }
  },
  handler: (_request, h) => {
    return h.view('start', { pageTitle: 'Start using the Farm and Land Service' })
  }
}

const home = {
  method: 'GET',
  path: '/home',
  handler: async (request, h) => {
    const { auth, yar } = request

    const isOnWoodlandManagementAllowList = yar.get('isOnWoodlandManagementAllowList')
    const woodlandManagementUrl = yar.get('woodlandManagementUrl')
    const data = await fetchPersonalBusinessDetailsService(auth.credentials)
    const pageData = homePresenter(data, auth.credentials.scope, auth.credentials.enrolmentCount, isOnWoodlandManagementAllowList, woodlandManagementUrl)

    return h.view('home', pageData)
  }
}

export const homeRoutes = [
  start,
  home
]

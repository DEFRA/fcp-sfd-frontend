import { pageNotFoundPresenter } from '../../presenters/errors/page-not-found-presenter.js'

export const pageNotFound = {
  method: 'GET',
  path: '/page-not-found',
  options: {
    auth: { strategy: 'session', mode: 'try' }
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('errors/page-not-found', pageNotFoundPresenter(backLink))
  }
}

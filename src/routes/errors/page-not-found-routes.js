export const pageNotFound = {
  method: 'GET',
  path: '/page-not-found',
  options: {
    auth: { strategy: 'session', mode: 'try' }
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('errors/page-not-found', { backLink })
  }
}

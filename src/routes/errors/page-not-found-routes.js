export const pageNotFound = {
  method: 'GET',
  path: '/page-not-found',
  options: {
    auth: false
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('errors/page-not-found', { backLink })
  }
}

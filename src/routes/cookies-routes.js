export const cookies = {
  method: 'GET',
  path: '/cookies',
  handler: (_request, h) => {
    backLink = request.headers.referer
    return h.view('cookies', {
      pageTitle: 'Cookies',
      heading: 'How we use cookies to store information about how you use this service.',
      backLink
    })
  }
}

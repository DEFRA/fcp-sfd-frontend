export const serviceUnavailable = {
  method: 'GET',
  path: '/service-unavailable',
  options: {
    auth: false
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('errors/service-unavailable', { backLink })
  }
}

export const serviceUnavailable = {
  method: 'GET',
  path: '/service-unavailable',
  handler: (_request, h) => {
    return h.view('errors/service-unavailable', {
      pageTitle: 'Service Unavailable',
      heading: 'Sorry, the service is unavailable'
    })
  }
}

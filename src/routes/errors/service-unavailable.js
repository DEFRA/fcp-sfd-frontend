export const serviceUnavailable = {
  method: 'GET',
  path: '/service-unavailable',
  handler: (_request, h) => {
    return h.view('errors/service-unavailable', {
      pageTitle: 'Sorry, the service is unavailable - Manage your land and farm businesses - GOV.UK',
      heading: 'The service is not currently available, but you can contact us.'
    })
  }
}

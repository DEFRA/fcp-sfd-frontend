export const serviceProblem = {
  method: 'GET',
  path: '/errors/service-problem',
  handler: (_request, h) => {
    return h.view('errors/service-problem', {
      pageTitle: 'Sorry, there is a problem with the service - Manage your land and farm businesses - GOV.UK',
      heading: 'There is a problem with this service, but you can contact us.'
    })
  }
}

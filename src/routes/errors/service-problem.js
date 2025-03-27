export const serviceProblem = {
  method: 'GET',
  path: '/service-problem',
  handler: (_request, h) => {
    return h.view('errors/service-problem', {
      pageTitle: 'Sorry, there is a problem with the service',
      heading: 'There is a problem with this service, but you can contact us.'
    })
  }
}

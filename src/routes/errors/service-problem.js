export const serviceProblem = {
  method: 'GET',
  path: '/errors/service-problem',
  handler: (_request, h) => {
    return h.view('errors/service-problem', {
      pageTitle: 'Service Problem',
      heading: 'Sorry, there is a problem with the service'
    })
  }
}

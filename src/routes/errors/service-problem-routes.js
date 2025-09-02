export const serviceProblem = {
  method: 'GET',
  path: '/service-problem',
  options: {
    auth: { strategy: 'session', mode: 'try' }
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('errors/service-problem', { backLink })
  }
}

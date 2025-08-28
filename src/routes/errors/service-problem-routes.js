export const serviceProblem = {
  method: 'GET',
  path: '/service-problem',
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('errors/service-problem', { backLink })
  }
}

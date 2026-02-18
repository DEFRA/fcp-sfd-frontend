export const catchAllNotFound = {
  method: '*',
  path: '/{any*}', // matches any path that hasn't been matched by previous routes
  options: {
    auth: { strategy: 'session', mode: 'try' }
  },
  handler: (_request, h) => {
    return h.view('errors/page-not-found').code(404)
  }
}

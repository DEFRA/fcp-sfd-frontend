export const index = {
  method: 'GET',
  path: '/',
  options: {
    auth: { mode: 'try' }
  },
  handler: (_request, h) => {
    return h.view('index', {
      pageTitle: 'Welcome to Single Front Door (SFD) Portal',
      heading: 'Single Front Door'
    })
  }
}

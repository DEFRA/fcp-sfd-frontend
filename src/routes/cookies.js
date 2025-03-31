export const cookies = {
  method: 'GET',
  path: '/cookies',
  handler: (_request, h) => {
    return h.view('cookies', {
      pageTitle: 'Cookies - Manage your land and farm businesses - GOV.UK',
      heading: 'How we use cookies to store information about how you use this service.'
    })
  }
}

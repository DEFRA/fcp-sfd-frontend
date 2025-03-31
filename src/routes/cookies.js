export const cookies = {
  method: 'GET',
  path: '/cookies',
  handler: (_request, h) => {
    return h.view('cookies', {
      pageTitle: 'Cookies',
      heading: 'Cookies'
    })
  }
}

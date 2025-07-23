export const home = {
  method: 'GET',
  path: '/',
  handler: (_request, h) => {
    return h.view('home', {
      pageTitle: 'Your business',
      heading: 'businessName'
    })
  }
}

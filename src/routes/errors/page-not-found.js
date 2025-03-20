export const pageNotFound = {
  method: 'GET',
  path: '/errors/page-not-found',
  handler: (_request, h) => {
    return h.view('errors/page-not-found', {
      pageTitle: 'Page not found - Manage your land and farm businesses - GOV.UK',
      heading: 'We could not find this page. Check the web address is correct and try again.'
    })
  }
}

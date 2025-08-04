export const accessibilityStatement = {
  method: 'GET',
  path: '/accessibility-statement',
  handler: (_request, h) => {
    backLink = request.headers.referer
    return h.view('footer/accessibility-statement', {
      pageTitle: 'Accessibility statement',
      heading: 'Accessibility statement',
      backLink
    })
  }
}

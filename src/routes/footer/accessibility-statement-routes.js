export const accessibilityStatement = {
  method: 'GET',
  path: '/accessibility-statement',
  options: {
    auth: false
  },
  handler: (request, h) => {
    const backLink = request.headers.referer
    return h.view('footer/accessibility-statement', {
      pageTitle: 'Accessibility statement',
      heading: 'Accessibility statement',
      backLink
    })
  }
}

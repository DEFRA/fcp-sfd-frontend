export const accessibilityStatement = {
  method: 'GET',
  path: '/accessibility-statement',
  handler: (_request, h) => {
    return h.view('footer/accessibility-statement', {
      pageTitle: 'Accessibility statement',
      heading: 'Accessibility statement'
    })
  }
}

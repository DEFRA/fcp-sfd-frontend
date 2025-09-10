import { dynamicBacklink } from '../../utils/dynamic-backlink.js'

export const accessibilityStatement = {
  method: 'GET',
  path: '/accessibility-statement',
  handler: (request, h) => {
    return h.view('footer/accessibility-statement', {
      pageTitle: 'Accessibility statement',
      heading: 'Accessibility statement',
      backLink: { href: dynamicBacklink(request.headers.referer) }
    })
  }
}

import { dynamicBacklink } from '../utils/dynamic-backlink.js'

export const cookies = {
  method: 'GET',
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies', {
      pageTitle: 'Cookies',
      heading: 'How we use cookies to store information about how you use this service.',
      backLink: { href: dynamicBacklink(request.headers.referer) }
    })
  }
}

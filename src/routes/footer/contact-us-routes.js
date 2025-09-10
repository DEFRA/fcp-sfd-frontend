import { dynamicBacklink } from '../../utils/dynamic-backlink.js'

export const contactUs = {
  method: 'GET',
  path: '/contact-help',
  handler: (request, h) => {
      console.log('🚀 ~ request.headers.referer:', request.headers.referer)
    return h.view('footer/contact-help', {
      pageTitle: 'Contact us for help',
      heading: 'How to contact this service if you need help.',
      backLink: { href: dynamicBacklink(request.headers.referer) }
    })
  }
}

export const contactUs = {
  method: 'GET',
  path: '/contact-us',
  handler: (_request, h) => {
    return h.view('footer/contact-us', {
      pageTitle: 'Contact us for help',
      heading: 'How to contact this service if you need help.'
    })
  }
}

/**
 * Formats data ready for presenting in the `/page-not-found` page
 * @module pageNotFoundPresenter
 */

const pageNotFoundPresenter = (backLink) => {
  return {
    backLink,
    pageTitle: 'Page not found',
    metaDescription: 'We could not find this page. Check the web address is correct and try again.',
    contactHelpLink: '/contact-help'
  }
}

export {
  pageNotFoundPresenter
}

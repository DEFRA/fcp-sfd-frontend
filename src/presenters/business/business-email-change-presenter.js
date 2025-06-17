/**
 * Formats data ready for presenting in the `/business-details` page
 * @module businessEmailChangePresenter
 */

const businessEmailChangePresenter = (data, yar) => {
  return {
    notification: yar ? yar.flash('notification')[0] : null,
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    businessEmail: data.changeBusinessEmail
  }
}

export {
  businessEmailChangePresenter
}

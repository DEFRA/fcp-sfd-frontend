/**
 * Formats data ready for presenting in the `/business-email-change` page
 * @module businessEmailEnterPresenter
 */

const businessEmailChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business email address?',
    metaDescription: 'Update the email address for your business.',
    userName: data.customer.userName ?? null,
    businessEmail: payload ?? data.changeBusinessEmail ?? data.email,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessEmailChangePresenter
}

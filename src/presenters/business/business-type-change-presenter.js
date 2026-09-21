/**
 * Formats data ready for presenting in the `/business-type-change` page
 * @module businessTypeChangePresenter
 */

const businessTypeChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    returnToBusinessDetailsLink: '/business-details',
    pageTitle: 'Change your business type',
    metaDescription: 'Update the type of your business.',
    userName: data.customer.userName ?? null,
    businessName: data.businessName ?? null,
    businessType: data.type ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessTypeChangePresenter
}

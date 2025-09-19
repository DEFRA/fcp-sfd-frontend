/**
 * Formats data ready for presenting in the `/business-type-change` page
 * @module businessTypeChangePresenter
 */

const businessTypeChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Change your business type',
    metaDescription: 'Update the type of your business.',
    businessName: data.info.businessName ?? null,
    businessType: data.info.type ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null
  }
}

export {
  businessTypeChangePresenter
}

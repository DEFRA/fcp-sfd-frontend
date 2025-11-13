/**
 * Formats data ready for presenting in the `/business-type-change` page
 * @module businessTypeChangePresenter
 */

const businessTypeChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Change your business type',
    metaDescription: 'Update the type of your business.',
    userName: data.customer.userName ?? null,
    businessName: data.info.businessName ?? null,
    businessType: data.info.type ?? null,
    sbi: data.info.sbi ?? null
  }
}

export {
  businessTypeChangePresenter
}

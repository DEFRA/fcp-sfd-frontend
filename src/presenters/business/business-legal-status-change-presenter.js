/**
 * Formats data ready for presenting in the `/business-legal-status-change` page
 * @module businessLegalStatusChangePresenter
 */

const businessLegalStatusChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Change your legal status',
    metaDescription: 'Update the legal status of your business.',
    userName: data.customer.userName ?? null,
    businessName: data.info.businessName ?? null,
    businessLegalStatus: data.info.legalStatus ?? null,
    sbi: data.info.sbi ?? null
  }
}

export {
  businessLegalStatusChangePresenter
}

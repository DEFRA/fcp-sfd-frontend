/**
 * Formats data ready for presenting in the `/business-charity-registration-number-change` page
 * @module businessCharityRegistrationNumberChangePresenter
 */

const businessCharityRegistrationNumberChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter the charity commission registration number',
    metaDescription: 'Update the charity commission registration number for your business.',
    userName: data.customer.userName ?? null,
    charityCommissionRegistrationNumber: payload ?? data.changeBusinessCharityRegistrationNumber ?? data.registrationNumbers?.charityCommission,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessCharityRegistrationNumberChangePresenter
}

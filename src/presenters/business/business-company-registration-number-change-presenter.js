/**
 * Formats data ready for presenting in the `/business-company-registration-number-change` page
 * @module businessCompanyRegistrationNumberChangePresenter
 */

const businessCompanyRegistrationNumberChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter the company registration number',
    metaDescription: 'Update the company registration number for your business.',
    userName: data.customer.userName ?? null,
    companyRegistrationNumber: payload ?? data.changeBusinessCompanyRegistrationNumber ?? data.registrationNumbers?.companiesHouse,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessCompanyRegistrationNumberChangePresenter
}

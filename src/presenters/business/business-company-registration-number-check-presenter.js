/**
 * Formats data ready for presenting in the `/business-company-registration-number-check` page
 * @module businessCompanyRegistrationNumberCheckPresenter
 */

import { REGISTRATION_NUMBER_CHANGE_LINKS } from '../../constants/change-links.js'

const businessCompanyRegistrationNumberCheckPresenter = (data) => {
  return {
    backLink: { href: REGISTRATION_NUMBER_CHANGE_LINKS.businessCompanyRegistrationNumber },
    changeLink: REGISTRATION_NUMBER_CHANGE_LINKS.businessCompanyRegistrationNumber,
    pageTitle: 'Check your company registration number is correct before submitting',
    metaDescription: 'Check the company registration number for your business is correct.',
    userName: data.customer.userName ?? null,
    companyRegistrationNumber: data.changeBusinessCompanyRegistrationNumber ?? data.registrationNumbers?.companiesHouse ?? null,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessCompanyRegistrationNumberCheckPresenter
}

/**
 * Formats data ready for presenting in the `/business-charity-registration-number-check` page
 * @module businessCharityRegistrationNumberCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

const businessCharityRegistrationNumberCheckPresenter = (data) => {
  return {
    backLink: { href: BUSINESS_CHANGE_LINKS.businessCharityRegistrationNumber },
    changeLink: BUSINESS_CHANGE_LINKS.businessCharityRegistrationNumber,
    pageTitle: 'Check your charity commission registration number is correct before submitting',
    metaDescription: 'Check the charity commission registration number for your business is correct.',
    userName: data.customer.userName ?? null,
    charityCommissionRegistrationNumber: data.changeBusinessCharityRegistrationNumber ?? data.registrationNumbers?.charityCommission ?? null,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessCharityRegistrationNumberCheckPresenter
}

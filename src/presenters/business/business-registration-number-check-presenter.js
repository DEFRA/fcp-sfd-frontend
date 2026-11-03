/**
 * Formats data ready for presenting in the `/business-registration-number-check` page
 * @module businessRegistrationNumberCheckPresenter
 */

import { constants } from '@defra/fcp-sfd-frontend-engine'

const { BUSINESS: BUSINESS_CHANGE_LINKS } = constants.changeLinks.external

const businessRegistrationNumberCheckPresenter = (data) => {
  const legalStatusCode = String(data.legalStatusCode ?? '')
  const isCharity = constants.business.CHARITY_REGISTRATION_LEGAL_STATUS_CODES.includes(legalStatusCode)

  const registrationNumberLabel = isCharity ? 'Charity commission registration number' : 'Company registration number'

  return {
    backLink: { href: BUSINESS_CHANGE_LINKS.businessLegalStatusRegistrationNumber },
    changeLink: BUSINESS_CHANGE_LINKS.businessLegalStatusRegistrationNumber,
    pageTitle: `Check your ${registrationNumberLabel.toLowerCase()} is correct before submitting`,
    metaDescription: `Check the ${registrationNumberLabel.toLowerCase()} for your business is correct.`,
    userName: data.customer?.userName ?? null,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null,
    registrationNumberLabel,
    registrationNumber: getRegistrationNumber(data, isCharity)
  }
}

const getRegistrationNumber = (data, isCharity) => {
  if (isCharity) {
    return data.changeBusinessCharityCommissionRegistrationNumber ?? data.registrationNumbers?.charityCommission ?? null
  }

  return data.changeBusinessCompanyRegistrationNumber ?? data.registrationNumbers?.companiesHouse ?? null
}

export {
  businessRegistrationNumberCheckPresenter
}

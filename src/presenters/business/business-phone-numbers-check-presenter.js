/**
 * Formats data ready for presenting in the `/business-phone-numbers-check` page
 * @module businessPhoneNumbersCheckPresenter
 */

const businessPhoneNumbersCheckPresenter = (businessDetails) => {
  return {
    backLink: { href: '/business-phone-numbers-change' },
    changeLink: '/business-phone-numbers-change',
    pageTitle: 'Check your business phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your business are correct.',
    userName: businessDetails.customer.userName || null,
    businessName: businessDetails.info.businessName ?? null,
    sbi: businessDetails.info.sbi ?? null,
    businessMobile: businessDetails.changeBusinessPhoneNumbers.businessMobile ?? null,
    businessTelephone: businessDetails.changeBusinessPhoneNumbers.businessTelephone ?? null
  }
}

export {
  businessPhoneNumbersCheckPresenter
}

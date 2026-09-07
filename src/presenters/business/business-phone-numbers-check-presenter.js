/**
 * Formats data ready for presenting in the `/business-phone-numbers-check` page
 * @module businessPhoneNumbersCheckPresenter
 */

const businessPhoneNumbersCheckPresenter = (data) => {
  return {
    backLink: { href: '/business-phone-numbers-change' },
    changeLink: '/business-phone-numbers-change',
    pageTitle: 'Check your business phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your business are correct.',
    userName: data.customer.userName ?? null,
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    businessMobile: data.changeBusinessPhoneNumbers.businessMobile ?? null,
    businessTelephone: data.changeBusinessPhoneNumbers.businessTelephone ?? null
  }
}

export {
  businessPhoneNumbersCheckPresenter
}

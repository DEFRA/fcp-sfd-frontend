const businessPhoneNumbersCheckPresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Check your business phone numbers are correct before submitting',
    metaDescription: 'Check the phone numbers for your business are correct.',
    businessTelephone: data.changeBusinessPhones?.telephone ?? 'Not added',
    businessMobile: data.changeBusinessPhones?.mobile ?? 'Not added',
    businessName: data.businessName,
    sbi: data.sbi,
    userName: data.userName
  }
}

export {
  businessPhoneNumbersCheckPresenter
}

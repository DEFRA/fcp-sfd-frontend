const businessPhoneNumbersChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What are your business phone numbers?',
    metaDescription: 'Update the phone numbers for your business.',
    businessTelephone: data.changeBusinessPhones?.telephone ?? '',
    businessMobile: data.changeBusinessPhones?.mobile ?? '',
    businessName: data.businessName,
    sbi: data.sbi,
    userName: data.userName
  }
}

export {
  businessPhoneNumbersChangePresenter
}

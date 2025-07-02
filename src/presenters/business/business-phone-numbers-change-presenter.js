const businessPhoneNumbersChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
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

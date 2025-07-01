const businessPhoneNumbersCheckPresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    businessTelephone: (data.changeBusinessPhones && data.changeBusinessPhones.telephone) ?? 'Not added',
    businessMobile: (data.changeBusinessPhones && data.changeBusinessPhones.mobile) ?? 'Not added',
    businessName: data.businessName,
    sbi: data.sbi,
    userName: data.userName
  }
}

export {
  businessPhoneNumbersCheckPresenter
}

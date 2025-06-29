const businessEmailChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'View and update your business details',
    metaDescription: 'View and change the details for your business.',
    businessEmail: data.changeBusinessEmail,
    businessName: data.businessName,
    sbi: data.sbi,
    userName: data.userName
  }
}

export {
  businessEmailChangePresenter
}

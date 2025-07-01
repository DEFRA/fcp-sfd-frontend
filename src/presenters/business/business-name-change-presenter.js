const businessNameChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business name?',
    metaDescription: 'Update the name for your business.',
    businessName: data.businessName,
    changeBusinessName: data.changeBusinessName,
    sbi: data.sbi,
    userName: data.userName
  }
}

export {
  businessNameChangePresenter
}

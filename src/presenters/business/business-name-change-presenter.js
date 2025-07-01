const businessNameChangePresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business name?',
    metaDescription: 'Update the name for your business.',
    businessName: data.businessName ?? null,
    changeBusinessName: data.changeBusinessName ?? null,
    sbi: data.sbi ?? null,
    userName: data.userName ?? null
  }
}

export {
  businessNameChangePresenter
}

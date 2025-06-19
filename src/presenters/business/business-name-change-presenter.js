/**
 * Formats data ready for presenting in the `/business-name-change` page
 * @module businessNameChangePresenter
 */

const businessNameChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business name?',
    metaDescription: 'Update the name for your business.',
    businessName: businessName(payload, data),
    subHeader: {
      businessName: data.businessName ?? null,
      sbi: data.sbi ?? null,
      userName: data.userName ?? null
    }
  }
}

const businessName = (payload, data) => {
  if(payload) {
    return payload
  }

  if(data.newBusinessName) {
    return data.newBusinessName
  }

  return data.businessName
}

export {
  businessNameChangePresenter
}

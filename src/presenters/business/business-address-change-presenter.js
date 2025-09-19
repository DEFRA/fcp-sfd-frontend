/**
 * Formats data ready for presenting in the `/business-address-change` page
 * @module businessAddressChangePresenter
 */

const businessAddressChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'What is your business address?',
    metaDescription: 'Update the address for your business.',
    businessPostcode: payload ?? data.changeBusinessPostcode ?? data.address.postcode,
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null
  }
}

export {
  businessAddressChangePresenter
}

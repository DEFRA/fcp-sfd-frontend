/**
 * Formats data ready for presenting in the `/business-address-change` page
 * @module businessAddressChangePresenter
 */

const businessAddressChangePresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    manualAddressLink: '/business-address-enter',
    pageTitle: 'What is your business address?',
    metaDescription: 'Update the address for your business.',
    userName: data.customer.userName ?? null,
    postcode: payload ?? data.changeBusinessPostcode?.postcode ?? data.address.postcode,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null
  }
}

export {
  businessAddressChangePresenter
}

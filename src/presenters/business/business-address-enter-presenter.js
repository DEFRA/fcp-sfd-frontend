/**
 * Formats data ready for presenting in the `/business-address-enter` page
 * @module businessAddressEnterPresenter
 */

const businessAddressEnterPresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: payload ?? data.businessAddress,
    businessName: data.businessName ?? null,
    sbi: data.sbi ?? null,
    userName: data.userName ?? null
  }
}

export {
  businessAddressEnterPresenter
}

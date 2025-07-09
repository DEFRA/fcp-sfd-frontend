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
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.userName ?? null
  }
}

export {
  businessAddressEnterPresenter
}

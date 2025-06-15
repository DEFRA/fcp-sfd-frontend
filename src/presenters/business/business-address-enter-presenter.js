/**
 * Formats data ready for presenting in the `/business-address-enter` page
 * @module businessAddressEnterPresenter
 */

const businessAddressEnterPresenter = (data) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: data.businessAddress,
    businessName: data.businessName ?? null,
    singleBusinessIdentifier: data.singleBusinessIdentifier ?? null,
    userName: data.userName ?? null
  }
}

export {
  businessAddressEnterPresenter
}

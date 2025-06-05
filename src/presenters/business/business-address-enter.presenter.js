/**
 * Formats data ready for presenting in the `/business-address-enter` page
 * @module businessAddressEnterPresenter
 */

const businessAddressEnterPresenter = (data) => {
  // Sort back link
  // Deal with error messages
  return {
    backLink: '/business-details',
    businessName: 'Agile Farm Ltd',
    sbi: '12345678',
    userName: 'Andrew Farmer',
    pageTitle:'Enter your business address',
    metaDescription:'Enter your business address.',
    address: {
      address1: data.address1 ?? null,
      address2: data.address2 ?? null,
      city: data.city ?? null,
      county: data.county ?? null,
      postcode: data.postcode ?? null,
      country: data.country ?? null
    }
  }
}

export {
  businessAddressEnterPresenter
}

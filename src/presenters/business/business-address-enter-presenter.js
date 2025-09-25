/**
 * Formats data ready for presenting in the `/business-address-enter` page
 * @module businessAddressEnterPresenter
 */

const businessAddressEnterPresenter = (data, payload) => {
  return {
    backLink: { href: '/business-details' },
    pageTitle: 'Enter your business address',
    metaDescription: 'Enter the address for your business.',
    address: payload ?? data.changeBusinessAddress ?? formatAddress(data.address),
    businessName: data.info.businessName ?? null,
    sbi: data.info.sbi ?? null,
    userName: data.customer.fullName ?? null
  }
}

const formatAddress = (address) => {
  const { manual, lookup, country, postcode } = address

  // NOTE: There is a line 3 on the manual address provided from the data set
  // Unsure if this is used.
  return {
    address1: manual.line1 ?? lookup.buildingNumberRange ?? lookup.flatName ?? lookup.buildingName ?? null,
    address2: manual.line2 ?? lookup.street ?? null,
    address3: manual.line3 ?? null,
    city: manual.line4 ?? lookup.city ?? null,
    county: manual.line5 ?? lookup.county ?? null,
    country: country ?? null,
    postcode: postcode ?? null
  }
}

export {
  businessAddressEnterPresenter
}

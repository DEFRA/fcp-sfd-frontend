/**
 * Formats data ready for presenting in the `/personal-address-enter` page
 * @module personalAddressEnterPresenter
 */

const personalAddressEnterPresenter = (data, payload) => {
  return {
    backLink: { href: '/personal-details' },
    pageTitle: 'Enter your personal address',
    metaDescription: 'Enter the address for your personal account.',
    address: payload ?? data.changePersonalAddress ?? formatAddress(data.address),
    userName: data.info.fullName.fullNameJoined ?? null
  }
}

const formatAddress = (address) => {
  const { manual, country, postcode } = address

  // NOTE: There is a line 3 on the manual address provided from the data set
  // Unsure if this is used.
  return {
    address1: manual.line1 ?? null,
    address2: manual.line2 ?? null,
    address3: manual.line3 ?? null,
    city: manual.line4 ?? null,
    county: manual.line5 ?? null,
    country: country ?? null,
    postcode: postcode ?? null
  }
}

export {
  personalAddressEnterPresenter
}

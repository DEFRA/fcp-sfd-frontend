/**
 * Formats data ready for presenting in the `/account-address-check` page
 * @module personalAddressCheckPresenter
 */

const personalAddressCheckPresenter = (personalDetails) => {
  const { changePersonalAddress, address, info } = personalDetails

  return {
    backLink: backLink(changePersonalAddress?.postcodeLookup),
    changeLink: changeLink(changePersonalAddress?.postcodeLookup),
    pageTitle: 'Check your personal address is correct before submitting',
    metaDescription: 'Check the address for your personal account is correct.',
    address: formatAddress(changePersonalAddress ?? address),
    userName: info.fullName.fullNameJoined ?? null
  }
}

/**
 * Formats the personal address into an array of address parts.
 * - Removes falsy values (null, undefined, empty strings)
 * - When from postcode lookup, excludes `uprn`, `displayAddress` and `postcodeLookup` keys
 */
const formatAddress = (personalAddress) => {
  if (personalAddress.postcodeLookup) {
    const { uprn, displayAddress, postcodeLookup, ...addressParts } = personalAddress

    return Object.values(addressParts).filter(Boolean)
  } else {
    return Object.values(personalAddress).filter(Boolean)
  }
}

const backLink = (postcodeLookup) => {
  if (postcodeLookup) {
    return { href: '/account-address-select' }
  } else {
    return { href: '/account-address-enter' }
  }
}

const changeLink = (postcodeLookup) => {
  if (postcodeLookup) {
    return '/account-address-change'
  } else {
    return '/account-address-enter'
  }
}

export {
  personalAddressCheckPresenter
}
